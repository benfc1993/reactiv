import { ReactivNode } from '../types'
import { primitiveValue } from '../utils'

export function sanitiseChildren(children: ReactivNode[]): ReactivNode[] {
  return children.map((child) => {
    if (child instanceof Array) {
      return {
        tag: 'FRAGMENT',
        isComponent: false,
        props: {},
        children: [child],
        ref: null,
        rerender: true,
      }
    }
    if (primitiveValue(child)) {
      return {
        tag: 'TEXT',
        isComponent: false,
        props: { value: child === null ? '' : child },
        children: [],
        ref: null,
        rerender: true,
      }
    }

    return child
  })
}
