export type ReactivNodeBase = {
  tag: string
  props: Record<string, any>
  children: ReactivNode[]
  ref: HTMLElement | null
  rerender: boolean
}

export type ReactivElementNode = ReactivNodeBase & { isComponent: false }
export type ReactivComponentNode = ReactivNodeBase & {
  isComponent: true
  key: string
  fn: (props: Record<string, any>) => ReactivNode
}

export type ReactivNode = ReactivElementNode | ReactivComponentNode
export type ReactNode = ReactivNode

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
  | UseContextHook

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

export type UseContextHook = {
  context: ReactivNode | null
  cleanup?: () => void
}

export function isUseContextHook(hook: any): hook is UseContextHook {
  const keys = Object.keys(hook)
  return (
    keys.length === 2 &&
    (hook?.context === null || 'tag' in hook?.context) &&
    (!hook?.cleanup || typeof hook?.cleanup === 'function')
  )
}
