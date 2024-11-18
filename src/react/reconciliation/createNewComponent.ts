import { map } from '../globalState'
import { ComponentReactNode } from '../types'

export function createNewComponent(node: ComponentReactNode) {
  map.set(node.props.key, {
    component: node.fn,
    key: node.props.key,
    hooks: [],
    props: node.props,
    el: null,
  })
}
