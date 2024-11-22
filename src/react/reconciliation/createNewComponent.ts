import { nodePointers } from '../globalState'
import { ReactivComponentNode } from '../types'

export function createNewComponent(node: ReactivComponentNode) {
  nodePointers.set(node.props.key, null)
}
