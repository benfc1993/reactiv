import { globalKey, hookIndex } from '../globalState'
import { ReactivComponentNode, ReactivNode } from '../types'

export function mountComponent(
  component: ReactivComponentNode,
  props: Record<string, any>,
  key: string
): ReactivNode {
  globalKey.value = key
  hookIndex.value = 0

  return component.fn(props)
}
