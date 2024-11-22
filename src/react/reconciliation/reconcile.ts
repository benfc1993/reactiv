import { addToDevTree, commitNode, Action } from '../../devTools'
import { map } from '../globalState'
import { ReactivNode } from '../types'
import { isPrimitiveValue } from '../utils'
import { createNewComponent } from './createNewComponent'
import { mountComponent } from './mountComponent'
import { unmountComponent } from './unmountComponent'

const addedkeys = new Set<string>()

export function reconcile(before: ReactivNode, after: ReactivNode) {
  let current = after

  // Reconcile if the ReactNode is a component
  if (before.isComponent && after.isComponent && before.tag === after.tag) {
    addToDevTree(
      before.key,
      before.tag,
      before.key === after.key ? Action.ADDED_COMPONENT : Action.RE_RENDER
    )

    addedkeys.delete(after.key)

    current.children = [
      mountComponent(after, { ...after.props }, before.key),
    ].flatMap((child) => child)

    const key = before.key
    const cache = map.get(key)

    if (cache) cache.el = before

    before.props = { ...after.props }
    after.key = before.key

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
      if (beforeChild !== afterChild) {
        before.rerender = true
        before.children[i] = afterChild
      }
      continue
    }

    if (
      beforeChild?.props &&
      afterChild?.props &&
      propDif(beforeChild, afterChild)
    ) {
      beforeChild.rerender = true
      afterChild.rerender = true
    }

    // if one child is false or null the node needs to be removed or added
    if (
      isNullChild(beforeChild) ||
      isNullChild(afterChild) ||
      beforeChild.tag !== afterChild.tag
    ) {
      if ((beforeChild && !afterChild) || beforeChild.tag !== afterChild.tag) {
        console.log('Unmount null child')
        unmountComponent(beforeChild)
      }
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

      // If no key provided to list items rerender the entire list
      if (afterChild.some((child) => !child?.props?.key)) {
        before.rerender = true
        ;(before.children[i] as unknown as ReactivNode[]) = afterChild.map(
          (child) =>
            ({
              ...child,
              rerender: true,
            }) as ReactivNode
        )
      } else {
        beforeChild.map((bC) => {
          const existingItem: ReactivNode | undefined = afterChild.find(
            (c) => c.key === bC.key
          )
          if (!existingItem) unmountComponent(bC)
        })
        ;(before.children[i] as unknown as ReactivNode[]) = (
          afterChild as ReactivNode[]
        ).map((aC) => {
          const existingItem: ReactivNode | undefined = beforeChild.find(
            (c) => c.props.key === aC.props.key
          )
          if (existingItem) {
            return {
              ...existingItem,
              props: { ...aC.props, key: existingItem.props.key },
              rerender: propDif(existingItem, aC),
            }
          }
          if (aC.isComponent) createNewComponent(aC)
          return aC
        }) as ReactivNode[]
      }

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

function propDif(a: ReactivNode, b: ReactivNode) {
  if (a.props === b.props) return false
  if (!a?.props && !b?.props) return false
  if (!a?.props && b?.props) return true
  if (a?.props && !b?.props) return true
  return Object.entries(a.props).some(([key, value]) => {
    if (!isPrimitiveValue(value)) return false
    return b.props[key] !== value
  })
}
