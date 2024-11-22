import { Action, addAction } from '../../devTools'
import { hookIndex, globalKey, nodePointers } from '../globalState'
import { isUseEffectHook, UseEffectHook } from '../types'

export function useEffect(
  callback: () => void | (() => void),
  dependencies?: any[]
) {
  const idx = hookIndex.value
  const internalKey = globalKey.value
  hookIndex.value += 1

  return (() => {
    const cache = nodePointers.get(internalKey)

    if (!cache) throw new Error('no cache found for useEffect')

    if (!cache.hooks[idx])
      cache.hooks[idx] = {
        cleanup: () => null,
      } as UseEffectHook
    const hook = cache.hooks[idx]

    if (!isUseEffectHook(hook)) return

    if (
      !dependencies ||
      !hook.dependencies ||
      hook.dependencies.some((dep, i) => dep !== dependencies[i])
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
