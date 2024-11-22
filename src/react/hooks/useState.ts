import { Action, addAction } from '../../devTools'
import {
  hookIndex,
  globalKey,
  nodePointers,
  addToRenderQueue,
  scheduler,
} from '../globalState'
import { rerender } from '../rerender'
import { isUseStateHook } from '../types'

export function useState<TState>(
  initialState: TState | (() => TState)
): [TState, (next: TState | ((current: TState) => TState)) => void] {
  const idx = hookIndex.value
  const internalKey = globalKey.value
  hookIndex.value += 1

  return (() => {
    const cache = nodePointers.get(internalKey)

    if (!cache) throw new Error('Cache not found for useState')
    if (!cache?.hooks[idx])
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
        `State updated from ${prevValue instanceof Object ? JSON.stringify(prevValue) : prevValue} to ${prevValue instanceof Object ? JSON.stringify(hook.value) : hook.value}`,
        true
      )
      scheduler.add(() => {
        rerender(cache.fn, {
          ...cache.props,
          key: internalKey,
        })
      })
    }
    if (!isUseStateHook(hook))
      throw Error('Cached useState hook invalid format')

    return [hook.value, setState]
  })()
}
