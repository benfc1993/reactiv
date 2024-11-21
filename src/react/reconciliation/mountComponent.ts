import { globalKey, hookIndex } from '../globalState'
import { ComponentReactNode, ReactivNode } from '../types'

export function mountComponent(
  component: ComponentReactNode,
  props: Record<string, any>
): ReactivNode | ReactivNode[] {
  globalKey.value = props?.key
  hookIndex.value = 0

  return component.fn(props)
}
