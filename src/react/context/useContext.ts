import { hookIndex, globalKey, map, getVDomRoot } from '../globalState'
import { isUseContextHook, ReactivNode } from '../types'

function checkChild(
  node: ReactivNode,
  // context: (props: Record<string, any>) => ReactivNode
  context: string
) {
  console.log('checkChild')

  if (node.isComponent && node.tag === context) {
    return node
  }
  return node.children.forEach((child) => checkChild(child, context))
}

export function useContext(context: (...args: any[]) => ReactivNode) {
  const idx = hookIndex.value
  const internalKey = globalKey.value
  hookIndex.value += 1
  return (() => {
    const cache = map.get(internalKey)
    if (!cache) throw new Error('cache not found for useContext')
    if (!cache.hooks[idx]) {
      const contextNode = checkChild(getVDomRoot()!, context.name)

      // let parent = cache.el?.parent
      //
      // console.log(cache.el)
      // let contextNode = null
      // while (parent) {
      //   if (parent.isComponent && parent.fn === context) {
      //     contextNode = parent
      //     break
      //   }
      //   parent = parent.parent
      // }
      console.log({ contextNode })

      if (
        contextNode === null ||
        !contextNode?.props ||
        !('__consumers' in contextNode?.props)
      )
        throw new Error(
          'Component passed to useContext is not a context Provider'
        )

      contextNode?.props.__consumers.add(cache.el)

      cache.hooks[idx] = {
        context: contextNode,
        cleanup() {
          contextNode?.props.__consumers.delete(cache.el)
        },
      }
    }

    if (!isUseContextHook(cache.hooks[idx])) return undefined
    return cache.hooks[idx].context?.props?.value
  })()
}
