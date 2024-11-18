export type ReactNodeBase = {
  tag: string
  props: Record<string, any>
  children: ReactNode[]
  ref: HTMLElement | null
}

export type ElementReactNode = ReactNodeBase & { isComponent: false }
export type ComponentReactNode = ReactNodeBase & {
  isComponent: true
  fn: (props: Record<string, any>) => ReactNode
}

export type ReactNode = ElementReactNode | ComponentReactNode

export type NodeCache = {
  component: (...args: any[]) => ReactNode
  props: Record<string, any>
  hooks: CachedHook[]
  key: string
  el: ReactNode
}
export type CachedHook = UseStateHook | UseEffectHook | UseRefHook | UseMemoHook

type UseStateHook<TValue = any> = { value: TValue }
export function isUseStateHook(hook: any): hook is UseStateHook {
  const keys = Object.keys(hook)
  return keys.length === 1 && 'value' in hook
}
export type UseEffectHook = {
  dependencies: null | any[]
  cleanup?: () => void
}
export function isUseEffectHook(hook: any): hook is UseEffectHook {
  const keys = Object.keys(hook)
  return (
    keys.length === 2 &&
    (hook?.dependencies === null || hook?.dependencies instanceof Array) &&
    (!hook?.cleanup || typeof hook?.cleanup === 'function')
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
  dependencies: null | any[]
  value: TValue
}
export function isUseMemoHook(hook: any): hook is UseMemoHook {
  const keys = Object.keys(hook)
  return (
    keys.length === 2 &&
    (hook?.dependencies === null || hook?.dependencies instanceof Array) &&
    'value' in hook
  )
}
