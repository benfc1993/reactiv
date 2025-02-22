import { logEffectAction } from '../../devTools/actionLogging'
import { nodePointers } from '../globalState'
import { isUseEffectHook, UseEffectHook } from '../types'
import { initialiseHook } from './initialiseHook'

export function useEffect(
  callback: () => void | (() => void),
  dependencies?: any[]
) {
  const { idx, internalKey } = initialiseHook()

  return (async () => {
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
      // DevTools
      void logEffectAction(cache)

      hook.dependencies = dependencies
      hook.cleanup?.()
      const cleanup = callback()
      if (cleanup) hook.cleanup = cleanup

      return
    }
  })()
}
