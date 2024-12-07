import { sanitiseChildren } from '../createElement/sanitiseChildren'
import { hookIndex, globalKey, nodePointers, suspended } from '../globalState'
import { isComponentNode, isUseContextHook } from '../types'
import { initialContextValues } from './createContext'

type Provider = { Provider: (...props: any[]) => any }

export function useContext<
  TContext extends Provider,
  TValue = Parameters<TContext['Provider']>[0]['value'],
>(context: TContext) {
  const idx = hookIndex.value
  const internalKey = globalKey.value
  hookIndex.value += 1

  return (() => {
    const cache = nodePointers.get(internalKey)
    if (!cache) throw new Error('cache not found for useContext')

    if (!cache.hooks[idx]) {
      cache.hooks[idx] = {
        value: initialContextValues.get(context.Provider),
        contextNodeKey: null,
      }
    }
    const hook = cache.hooks[idx]

    if (!isUseContextHook<TValue>(hook))
      throw Error('Cached useContext hook invalid format')

    if (!hook.contextNodeKey) {
      suspended.add(() => {
        let contextNode = cache.return()
        while (contextNode) {
          if (
            isComponentNode(contextNode) &&
            contextNode.fn === context.Provider
          )
            break
          contextNode = contextNode.return()
        }
        if (!contextNode || !('value' in contextNode.props))
          throw new Error(
            'Component passed to useContext is not a context Provider'
          )

        cache.hooks[idx] = {
          value: contextNode.props.value,
          contextNodeKey: contextNode.key,
        }
        globalKey.value = internalKey
        hookIndex.value = 0
        const res = cache.fn(cache.props)
        cache.child = sanitiseChildren(cache, Array.isArray(res) ? res : [res])
      })
    } else {
      hook.value = nodePointers.get(hook.contextNodeKey ?? '')?.props.value
    }

    return hook.value
  })()
}
