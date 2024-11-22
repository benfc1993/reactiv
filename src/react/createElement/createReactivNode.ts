import { ReactivComponentNode, ReactivNode } from '../types'
import { sanitiseComponentProps } from './sanitiseProps'

export function createBlankReactivComponentNode(
  key: string,
  tag: (props: Record<string, any>) => ReactivNode,
  props: Record<string, any>,
  children: ReactivNode[]
): ReactivComponentNode {
  return {
    tag: tag.name,
    fn: tag,
    isComponent: true,
    children: [],
    props: sanitiseComponentProps({
      children,
      ...props,
    }),
    key,
    ref: null,
    rerender: true,
  }
}
