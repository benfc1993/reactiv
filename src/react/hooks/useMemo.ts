import { addAction, Action } from '../../devTools'
import { hookIndex, globalKey, map } from '../globalState'
import { isUseMemoHook } from '../types'

export function useMemo<TValue>(callback: () => TValue, dependencies?: any[]) {
  const idx = hookIndex.value
  const internalKey = globalKey.value
  hookIndex.value += 1

  return (() => {
    const cache = map.get(internalKey)
    if (!cache) throw new Error('Cache not found for useMemo')
    if (!cache.hooks[idx]) cache.hooks[idx] = { value: null }

    const hook = cache.hooks[idx]

    if (!isUseMemoHook(hook)) return
    if (
      !dependencies ||
      !hook.dependencies ||
      hook.dependencies.some((dep, i) => dep !== dependencies[i])
    ) {
      hook.value = callback()
      hook.dependencies = dependencies
      addAction(
        cache,
        Action.DEPENDENCY_CHANGE,
        'useMemo dependencies changed, running callback'
      )
    }
    return hook.value
  })()
}
