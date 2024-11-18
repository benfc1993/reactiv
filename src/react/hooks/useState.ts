import { Action, addAction } from '../../devTools'
import { hookIndex, globalKey, map, addToRenderQueue } from '../globalState'
import { rerender } from '../rerender'
import { isUseStateHook } from '../types'

export function useState<TState>(
  initialState: TState | (() => TState)
): [TState, (next: TState | ((current: TState) => TState)) => void] {
  const idx = hookIndex.value
  const internalKey = globalKey.value
  hookIndex.value += 1

  return (() => {
    const cache = map.get(internalKey)
    if (!cache.hooks[idx])
      cache.hooks[idx] = {
        value:
          typeof initialState === 'function'
            ? (initialState as Function)()
            : initialState,
      }

    const hook = cache.hooks[idx]

    const setState = async (next: TState | ((current: TState) => TState)) => {
      if (!isUseStateHook(hook)) return
      const prevValue = hook.value
      hook.value =
        typeof next === 'function' ? (next as Function)(hook.value) : next
      await addAction(
        cache,
        Action.STATE_CHANGE,
        `State updated from ${prevValue} to ${hook.value}`,
        true
      )
      addToRenderQueue(() =>
        rerender(cache.component, {
          ...cache.props,
          key: internalKey,
        })
      )
    }
    if (!isUseStateHook(hook))
      throw Error('Cached useState hook invalid format')

    return [hook.value, setState]
  })()
}
