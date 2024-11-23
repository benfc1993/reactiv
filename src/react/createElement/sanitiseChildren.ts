import { ReactivNode } from '../types'
import { primitiveValue } from '../utils'

export function sanitiseChildren(
  children: (ReactivNode | string | number | boolean | null)[]
): ReactivNode[] {
  return children.map((child) => {
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
