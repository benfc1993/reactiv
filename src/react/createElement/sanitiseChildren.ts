import { ReactivNode } from '../types'
import { primitiveValue } from '../utils'

export function sanitiseChildren(
  element: ReactivNode,
  children: ReactivNode[]
): ReactivNode | null {
  let last: ReactivNode | null = null
  let firstChild: ReactivNode | null = null

  children.forEach((child, idx) => {
    let newChild: ReactivNode | null = null

    switch (true) {
      case child instanceof Array:
        newChild = {
          tag: 'FRAGMENT',
          isComponent: false,
          props: {},
          child: null,
          sibling: null,
          ref: null,
          dirty: true,
          return: () => null,
          prev: () => null,
        }
        newChild.child = sanitiseChildren(newChild, child)
        break
      case primitiveValue(child):
        newChild = {
          tag: 'TEXT',
          isComponent: false,
          props: { value: child === null ? '' : child },
          child: null,
          sibling: null,
          ref: null,
          dirty: true,
          return: () => null,
          prev: () => null,
        }
        break
      default:
        newChild = child
        break
    }

    if (firstChild === null) firstChild = newChild

    if (last) last.sibling = newChild

    newChild.return = () => element
    if (idx > 0) (newChild.prev = () => children[idx - 1]), (last = newChild)

    last = newChild
  })
  return firstChild
}
