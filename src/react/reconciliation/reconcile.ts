import { addToDevTree, commitNode, Action } from '../../devTools'
import { map } from '../globalState'
import { ReactivNode } from '../types'
import { createNewComponent } from './createNewComponent'
import { mountComponent } from './mountComponent'

export function reconcile(before: ReactivNode, after: ReactivNode) {
  let current = after
  // Reconcile if the ReactNode is a component
  if (before.isComponent && after.isComponent && before.tag === after.tag) {
    addToDevTree(
      before.props.key,
      before.tag,
      before === after ? Action.ADDED_COMPONENT : Action.RE_RENDER
    )

    current.children = [
      mountComponent(after, { ...after.props, key: before.props?.key }),
    ].flatMap((child) => child)

    const key = before.props.key
    const cache = map.get(key)

    if (cache) cache.el = before

    before.props = { ...after.props, key }

    if (before?.children.length === 0) {
      before.children = [...current.children]
    }
  }

  // loop through and reconcile children
  for (let i = 0; i < before.children.length; i++) {
    const beforeChild = before.children[i]
    const afterChild = current.children[i]

    // if both children are value types take the new value
    if (isPrimitiveValue(beforeChild) && isPrimitiveValue(afterChild)) {
      before.children[i] = afterChild
      continue
    }

    // if one child is false or null the node needs to be removed or added
    if (
      isNullChild(beforeChild) ||
      isNullChild(afterChild) ||
      beforeChild.tag !== afterChild.tag
    ) {
      if (afterChild) {
        before.children[i] = afterChild
        if (beforeChild?.isComponent) {
          map.delete(beforeChild.props.key)
        }
        if (afterChild.isComponent) createNewComponent(afterChild)
        reconcile(before.children[i], afterChild)
        continue
      }
      continue
    }

    // if both children are components call reconcile on them to mount and reconcile their resultant children
    if (beforeChild.isComponent && afterChild.isComponent) {
      reconcile(beforeChild, afterChild)
      continue
    }

    // if both before and after children are arrays loop over the arrays and reconcile the items using the keys to maintain state and relative positions
    if (beforeChild instanceof Array && afterChild instanceof Array) {
      // make sure the list of elements are in the order of after
      ;(before.children[i] as unknown as ReactivNode[]) = (
        afterChild as ReactivNode[]
      ).map((aC) => {
        const existingItem = beforeChild.find(
          (c) => c.props.key === aC.props.key
        )
        if (existingItem) {
          return {
            ...existingItem,
            props: { ...aC.props, key: existingItem.props.key },
          }
        }
        if (aC.isComponent) createNewComponent(aC)
        return aC
      }) as ReactivNode[]

      // loop through and reconcile all elements in the array
      ;(before.children[i] as unknown as ReactivNode[]).forEach(
        (element, idx) => {
          reconcile(element, afterChild[idx])
        }
      )

      continue
    }

    // if no above conditions are met copy props over and reconcile
    beforeChild.props = { ...afterChild.props }

    reconcile(beforeChild, afterChild)
  }

  if (before.isComponent) commitNode()
}

function isNullChild(child: ReactivNode | false | null): child is false {
  return child === false || child === null
}
function isPrimitiveValue(value: unknown): boolean {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    value === null ||
    typeof value === 'undefined'
  )
}
