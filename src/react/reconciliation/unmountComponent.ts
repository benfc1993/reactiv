import { Action, addAction, addToDevTree, commitNode } from '../../devTools'
import { map } from '../globalState'
import { ReactivNode } from '../types'

export async function unmountComponent(node: ReactivNode) {
  if (node.isComponent) {
    const cache = map.get(node.key)
    await addAction(cache!, Action.REMOVED_COMPONENT, 'Component removed', true)
  }

  node.ref?.parentNode?.removeChild(node.ref)
  if (!node.isComponent) return
  addToDevTree(node.key, node.tag, Action.REMOVED_COMPONENT)
  commitNode()

  const cache = map.get(node.key)
  if (!cache) return
  cache.hooks.forEach((hook) => {
    if ('cleanup' in hook) {
      hook.cleanup?.()
    }
  })
  map.delete(node.key)
}