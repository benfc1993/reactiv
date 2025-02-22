import { logStateAction } from '../../devTools/actionLogging'
import { nodePointers, scheduler } from '../globalState'
import { rerender } from '../rerender'
import { isUseStateHook } from '../types'
import { initialiseHook } from './initialiseHook'

export function useState<TState>(
  initialState: TState | (() => TState)
): [TState, (next: TState | ((current: TState) => TState)) => void] {
  const { idx, internalKey } = initialiseHook()

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

      // DevTools
      await logStateAction(cache, prevValue, hook.value)

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
