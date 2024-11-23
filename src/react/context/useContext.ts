import { hookIndex, globalKey, nodePointers, getVDomRoot } from '../globalState'
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

export function useContext<
  TContext extends (props: any) => any,
  TValue = Parameters<TContext>[0]['value'],
>(context: TContext) {
  const idx = hookIndex.value
  const internalKey = globalKey.value
  hookIndex.value += 1

  return (() => {
    const cache = nodePointers.get(internalKey)
    if (!cache) throw new Error('cache not found for useContext')

    if (!cache.hooks[idx]) {
      cache.hooks[idx] = {
        value: initialContextValues.get(context),
        contextNode: null,
      }
    }
    const hook = cache.hooks[idx]

    if (!isUseContextHook<TValue>(hook))
      throw Error('Cached useContext hook invalid format')

    if (!hook.contextNode) {
      scheduleUseContext(() => {
        const contextNode = checkChild(getVDomRoot()!, cache, context)
        if (!contextNode || !('value' in contextNode.props))
          throw new Error(
            'Component passed to useContext is not a context Provider'
          )

        cache.hooks[idx] = {
          value: contextNode.props.value,
          contextNode,
        }
      })
    } else {
      hook.value = hook.contextNode?.props.value
    }

    return hook.value
  })()
}
