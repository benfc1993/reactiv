import { addAction, Action } from '../../devTools'
import { nodePointers } from '../globalState'
import { isUseMemoHook } from '../types'
import { initialiseHook } from './initialiseHook'

export function useMemo<TValue>(callback: () => TValue, dependencies?: any[]) {
  const { idx, internalKey } = initialiseHook()

  return (() => {
    const cache = nodePointers.get(internalKey)
    if (!cache) throw new Error('Cache not found for useMemo')
    if (!cache.hooks[idx]) cache.hooks[idx] = { value: null }

    const hook = cache.hooks[idx]

    if (!isUseMemoHook(hook)) throw Error('Cached useMemo hook invalid format')
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
