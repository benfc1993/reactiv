import { hookIndex, globalKey, nodePointers, getVDomRoot } from '../globalState'
import { isUseContextHook, ReactivComponentNode, ReactivNode } from '../types'
import { scheduleUseContext } from './scheduleUseContext'

function checkChild(
  node: ReactivNode,
  target: ReactivNode,
  context: () => ReactivNode,
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

export function useContext(context: (...args: any[]) => ReactivNode) {
  const idx = hookIndex.value
  const internalKey = globalKey.value
  hookIndex.value += 1
  return (() => {
    const cache = nodePointers.get(internalKey)
    if (!cache) throw new Error('cache not found for useContext')
    if (!cache.hooks[idx]) {
      scheduleUseContext(() => {
        const contextNode = checkChild(getVDomRoot()!, cache, context)
        contextNode?.props.__consumers.add(cache)
        if (!contextNode) throw new Error('Provider not found')

        cache.hooks[idx] = {
          context: contextNode.key,
          cleanup() {
            contextNode?.props.__consumers.delete(cache)
          },
        }
      })
      return
    }
    const hook = cache.hooks[idx]
    if (!isUseContextHook(hook)) return

    if (hook.context === null)
      throw new Error(
        'Component passed to useContext is not a context Provider'
      )

    if (!isUseContextHook(cache.hooks[idx])) return undefined
    return nodePointers.get(cache.hooks[idx].context!)?.props?.value
  })()
}
