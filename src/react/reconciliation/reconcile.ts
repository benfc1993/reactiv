import { addToDevTree, commitNode, Action } from '../../devTools'
import { globalKey, hookIndex, map } from '../globalState'
import { ReactNode } from '../types'
import { createNewComponent } from './createNewComponent'

export function reconcile(before: ReactNode, after: ReactNode) {
  let current = after
  if (before.isComponent && after.isComponent && before.tag === after.tag) {
    addToDevTree(
      before.props.key,
      before.tag,
      before === after ? Action.ADDED_COMPONENT : Action.RE_RENDER
    )
    globalKey.value = before.props?.key
    hookIndex.value = 0
    current.children = [
      after.fn({ ...after.props, key: before.props?.key }),
    ].flatMap((child) => child)

    const key = before.props.key
    const cache = map.get(key)

    if (cache) cache.el = before

    before.props = { ...after.props, key }

    if (before?.children.length === 0) {
      before.children = [...current.children]
    }
  }

  for (let i = 0; i < before.children.length; i++) {
    const child = before.children[i]
    const afterChild = current.children[i]

    if (
      isNullChild(child) ||
      isNullChild(afterChild) ||
      child.tag !== afterChild.tag
    ) {
      if (afterChild) {
        before.children[i] = afterChild
        if (child?.isComponent) {
          map.delete(child.props.key)
        }
        if (afterChild.isComponent) createNewComponent(afterChild)
        reconcile(before.children[i], afterChild)
        continue
      }
      continue
    }

    if (
      child.isComponent &&
      afterChild.isComponent &&
      child.tag === afterChild.tag
    ) {
      reconcile(child, afterChild)
      continue
    }

    if (child instanceof Array && afterChild instanceof Array) {
      if (
        child.some((c) => !c.props?.key) ||
        afterChild.some((c) => !c.props?.key)
      ) {
        before.children[i] = afterChild
        continue
      }

      ;(before.children[i] as unknown as ReactNode[]) = (
        afterChild as ReactNode[]
      ).map((aC) => {
        const existingItem = child.find((c) => c.props.key === aC.props.key)
        if (existingItem) {
          return { ...existingItem, props: aC.props }
        }
        return aC
      }) as ReactNode[]

      continue
    }

    if (typeof child === 'string' || typeof child === 'number') {
      if (typeof afterChild === 'string' || typeof afterChild === 'number') {
        before.children[i] = afterChild
        continue
      }
    }

    if (child.tag === afterChild.tag) {
      if (afterChild.isComponent) {
        const res = afterChild.fn({
          ...afterChild.props,
          key: child.props.key!,
        })
        child.props = { ...afterChild.props }
        reconcile(child, res)
        continue
      }
    }
    child.props = { ...afterChild.props }

    reconcile(child, afterChild)
  }
  if (before.isComponent) commitNode()
}

function isNullChild(child: ReactNode | false | null): child is false {
  return child === false || child === null
}
