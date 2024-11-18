import { Action, addAction } from '../../devTools'
import { hookIndex, globalKey, map } from '../globalState'
import { isUseEffectHook, UseEffectHook } from '../types'

export function useEffect(
  callback: () => void | (() => void),
  dependencies: any[] = null
) {
  const idx = hookIndex.value
  const internalKey = globalKey.value
  hookIndex.value += 1

  return (() => {
    const cache = map.get(internalKey)
    if (!cache.hooks[idx])
      cache.hooks[idx] = {
        dependencies: null,
        cleanup: () => null,
      } as UseEffectHook
    const hook = cache.hooks[idx]

    if (!isUseEffectHook(hook)) return

    if (
      hook.dependencies === null ||
      hook?.dependencies?.some((dep, i) => dep !== dependencies[i])
    ) {
      void addAction(
        cache,
        Action.DEPENDENCY_CHANGE,
        'useEffect dependencies changed, running callback'
      )
      hook.dependencies = dependencies
      hook.cleanup?.()
      const cleanup = callback()
      if (cleanup) hook.cleanup = cleanup

      return
    }
    void addAction(
      cache,
      Action.DEPENDENCY_CHANGE,
      'useEffect dependencies NOT changed'
    )
  })()
}
