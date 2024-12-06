import { sanitiseChildren } from '../createElement/sanitiseChildren'
import { globalKey, hookIndex, nodePointers } from '../globalState'
import { itterateChildren } from '../render/createDomElement'
import { ReactivComponentNode, ReactivNode } from '../types'
import { unmountComponent } from './unmountComponent'
import { propDif } from './utils'

export function startReconcile(before: ReactivNode, after: ReactivNode) {
  const map = new Map()
  reconcile(before, after, map, true)
}

export function reconcile(
  before: ReactivNode,
  after: ReactivNode,
  map: Map<string, ReactivNode>,
  initialiser = false
) {
  let reconciled = false

  if (before.isComponent && after.isComponent) {
    globalKey.value = before.key
    hookIndex.value = 0
    after.key = before.key
    after.hooks = before.hooks
    after.ref = before.ref
    after.child = sanitiseChildren(after, [
      after.fn({ ...after.props, key: before.key }),
    ])
    itterateChildren(after, (node) => (node.return = () => after))
    if (before.sibling && !after.sibling && initialiser)
      after.sibling = before.sibling
  }

  itterateChildren(before, (node) => {
    if ('key' in node.props) map.set(node.props.key, node)
  })

  itterateChildren(after, (node) => {
    let stored
    if ('key' in node.props && (stored = map.get(node.props.key))) {
      if (stored.key) node.key = stored.key
      node.return = stored.return
      node.ref = stored.ref
    }
  })

  if (!addRemoveChild(before, after)) addRemoveSibling(before, after)

  if (!reconciled) reconciled = tagDiff(before, after)

  if (!reconciled) reconciled = propDiff(before, after)

  before.props = { ...after.props }

  let beforeChild = before.child
  let afterChild = after.child

  while (beforeChild && afterChild) {
    reconcile(beforeChild, afterChild, map)
    const prevBeforeChild = beforeChild
    beforeChild = beforeChild?.sibling
    afterChild = afterChild?.sibling

    if (beforeChild) beforeChild.prev = () => prevBeforeChild
  }
  itterateChildren(before, (node) => {
    node.return = () => before
    node.dirty = node.dirty || before.dirty
  })
}

function tagDiff(before: ReactivNode, after: ReactivNode) {
  if (before.tag !== after.tag) {
    console.log('tagDiff')
    unmountComponent(before)
    Object.assign(before, after)
    before.dirty = true
    return true
  }
  return false
}

function propDiff(before: ReactivNode, after: ReactivNode) {
  if (propDif(before, after)) {
    console.log('Prop diff')
    if ('key' in before.props) before.ref = after.ref
    before.dirty = true
    return true
  }
  if ('key' in before.props) before.ref = after.ref
  return false
}

function addRemoveChild(before: ReactivNode, after: ReactivNode) {
  // Add child
  if (before.child === null && after.child) {
    before.child = Object.assign({}, after.child)
    before.child.dirty = true
    itterateChildren(before.child, (node) => (node.dirty = true))

    if (before.child.isComponent) handleAddComponentNode(before.child)

    return true
  }

  // Remove child
  if (before?.child && !after.child) {
    if (before.child?.isComponent) {
      nodePointers.delete(before.child.key)
    }
    console.log('remove child')
    unmountComponent(before.child)
    before.child = null
    return true
  }
  return false
}
function addRemoveSibling(before: ReactivNode, after: ReactivNode) {
  // Add sibling
  if (before?.sibling === null && after?.sibling) {
    console.log('add sibling')
    before.sibling = Object.assign({}, after.sibling)
    before.sibling.dirty = true
    before.sibling.prev = () => before
    after.sibling.prev = () => after
    itterateChildren(before.sibling, (node) => (node.dirty = true))
    if (before.sibling.isComponent) handleAddComponentNode(before.sibling)
    return
  }

  // Remove sibling
  if (before?.sibling && !after?.sibling) {
    console.log('remove sibling')
    unmountComponent(before.sibling)
    before.sibling = null
  }
}

function handleAddComponentNode(node: ReactivComponentNode) {
  if (node.isComponent) nodePointers.set(node.key, node)
}
