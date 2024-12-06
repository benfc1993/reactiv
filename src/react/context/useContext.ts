import {
  hookIndex,
  globalKey,
  nodePointers,
  getVDomRoot,
  renderState,
} from '../globalState'
import { isUseContextHook, ReactivComponentNode, ReactivNode } from '../types'
import { initialContextValues } from './createContext'
import { scheduleUseContext } from './scheduleUseContext'

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
      scheduleUseContext(() => {
        let contextNode = cache.return()
        while (contextNode) {
          if (contextNode === contextNode) break
          contextNode = contextNode.return()
        }
        console.log(contextNode)
        if (!contextNode || !('value' in contextNode.props))
          throw new Error(
            'Component passed to useContext is not a context Provider'
          )

        cache.hooks[idx] = {
          value: contextNode.props.value,
          contextNodeKey: contextNode.key,
        }
      })
    } else {
      hook.value = nodePointers.get(hook.contextNodeKey ?? '')?.props.value
    }

    return hook.value
  })()
}
