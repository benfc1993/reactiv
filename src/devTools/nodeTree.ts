import { deepClone } from '../react/utils'
import { Action } from './step'

type DevTreeNode = {
  action: Action
  key: string
  tag: string
  children: DevTreeNode[]
}

const nodeTree: {
  current: DevTreeNode | null
  next: DevTreeNode | null
  partial: DevTreeNode
} = {
  current: null,
  next: null,
  partial: { children: [], key: '', tag: 'root', action: Action.NONE },
}

const nodeQueue: { children: DevTreeNode[] }[] = [nodeTree.partial]

export function addToDevTree(key: string, tag: string, action: Action) {
  const treeNode = {
    children: [],
    tag,
    key,
    action,
  }

  nodeQueue[0].children.push(treeNode)
  nodeQueue.unshift(treeNode)
}

export function commitNode() {
  nodeQueue.shift()
}

function replaceNode(node: DevTreeNode, start?: DevTreeNode) {
  const rootNode = start ? start : nodeTree.next
  if (!rootNode) {
    nodeTree.next = deepClone(node)
    return
  }

  for (let i = 0; i < rootNode.children.length; i++) {
    const child = rootNode.children[i]
    if (child.key === node.key && child.tag === node.tag) {
      rootNode.children[i] = node
      return true
    }
    if (replaceNode(node, child)) return true
  }
  return false
}

export function commitTree() {
  if (nodeTree.partial.children.length === 0) return
  if (nodeTree.partial.children.length === 1) {
    replaceNode(deepClone(nodeTree.partial.children[0]))
  } else {
    nodeTree.next = deepClone(nodeTree.partial)
  }
  nodeTree.partial.children = []

  if (!nodeTree.next) return

  const copy = deepClone(nodeTree.next)
  nodeTree.current = copy
  resetNodes(nodeTree.next)
  console.log(nodeTree)
}

function resetNodes(node: DevTreeNode) {
  node.action = Action.NONE

  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i]
    resetNodes(child)
  }
}
