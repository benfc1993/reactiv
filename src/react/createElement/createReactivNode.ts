import { ReactivComponentNode, ReactivNode } from '../types'
import { sanitiseComponentProps } from './sanitiseProps'

export function createBlankReactivComponentNode(
  key: string,
  tag: <TProps = any>(props: TProps) => ReactivNode,
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
    hooks: [],
    key,
    ref: null,
    rerender: true,
  }
}
