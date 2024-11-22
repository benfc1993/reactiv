import { map } from '../globalState'
import { ReactivComponentNode, ReactivNode } from '../types'

export function createNewComponent(node: ReactivComponentNode) {
  map.set(node.props.key, {
    component: node.fn,
    key: node.props.key,
    hooks: [],
    props: node.props,
    el: null,
  })
}
