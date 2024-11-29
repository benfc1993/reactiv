// TODO: change tag to type, this is then either a string or a component function
export type ReactivNodeBase = {
  tag: string
  props: Record<string, any>
  children: ReactivNode[]
  ref: HTMLElement | Text | null
  rerender: boolean
  isComponent: boolean
}

export type ReactivElementNode = ReactivNodeBase & {
  isComponent: false
  children: (ReactivNode | ReactivNode[])[]
  key?: string
}
export function isElementNode(
  node: ReactivNodeBase
): node is ReactivElementNode {
  return !!node.isComponent
}
export type ReactivComponentNode = ReactivNodeBase & {
  isComponent: true
  hooks: CachedHook[]
  key: string
  fn: <TProps = any>(props: TProps) => ReactivNode
}
export function isComponentNode(
  node: ReactivNodeBase
): node is ReactivComponentNode {
  return node.isComponent
}
export type ReactivNode = ReactivElementNode | ReactivComponentNode

export type NodeCache = {
  component: (...args: any[]) => ReactivNode
  props: Record<string, any>
  hooks: CachedHook[]
  key: string
  el: ReactivNode | null
}
export type CachedHook =
  | UseStateHook
  | UseEffectHook
  | UseRefHook
  | UseMemoHook
  | UseContextHook<any>

type UseStateHook<TValue = any> = { value: TValue }
export function isUseStateHook(hook: any): hook is UseStateHook {
  const keys = Object.keys(hook)
  return keys.length === 1 && 'value' in hook
}
export type UseEffectHook = {
  dependencies?: any[]
  cleanup?: () => void
}
export function isUseEffectHook(hook: any): hook is UseEffectHook {
  const keys = Object.keys(hook)
  return (
    (keys.length === 2 &&
      hook?.dependencies instanceof Array &&
      (!hook?.cleanup || typeof hook?.cleanup === 'function')) ||
    (keys.length === 1 &&
      (!hook?.cleanup || typeof hook?.cleanup === 'function'))
  )
}

export type UseRefHook<TValue = any> = {
  current: TValue
}
export function isUseRefHook(hook: any): hook is UseRefHook {
  const keys = Object.keys(hook)
  return keys.length === 1 && 'current' in hook
}

export type UseMemoHook<TValue = any> = {
  dependencies?: any[]
  value: TValue
}
export function isUseMemoHook(hook: any): hook is UseMemoHook {
  const keys = Object.keys(hook)
  return (
    (keys.length === 2 &&
      hook?.dependencies instanceof Array &&
      'value' in hook) ||
    (keys.length === 1 &&
      (!hook?.cleanup || typeof hook?.cleanup === 'function'))
  )
}

export type UseContextHook<TValue> = {
  value: TValue
  contextNodeKey: string | null
  cleanup?: () => void
}

export function isUseContextHook<TValue>(
  hook: any
): hook is UseContextHook<TValue> {
  const keys = Object.keys(hook)
  return (
    (keys.length === 2 && 'value' in hook && 'contextNodeKey' in hook) ||
    (keys.length === 3 &&
      'value' in hook &&
      'contextNode' in hook &&
      (!hook?.cleanup || typeof hook?.cleanup === 'function'))
  )
}
