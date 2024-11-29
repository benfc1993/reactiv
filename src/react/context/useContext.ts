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

function checkChild(
  node: ReactivNode,
  target: ReactivNode,
  context: (props: any) => any,
  contextNode: ReactivComponentNode | null = null
) {
  if (node.isComponent && node.fn === context) {
    contextNode = node
  }

  if (node === target) {
    return contextNode
  }

  for (let i = 0; i < node.children?.length; i++) {
    const child = node.children[i]
    const res = checkChild(child, target, context, contextNode)
    if (res) contextNode = res
  }
  return contextNode
}

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
        const contextNode = checkChild(getVDomRoot()!, cache, context.Provider)
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
