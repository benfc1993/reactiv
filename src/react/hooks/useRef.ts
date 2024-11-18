import { hookIndex, globalKey, map } from '../globalState'
import { isUseRefHook } from '../types'

export function useRef<TValue>(initialValue: TValue): { current: TValue } {
  const idx = hookIndex.value
  const internalKey = globalKey.value
  hookIndex.value += 1

  return (() => {
    const cache = map.get(internalKey)
    if (!cache.hooks[idx]) {
      cache.hooks[idx] = { current: initialValue }
    }
    const hook = cache.hooks[idx]
    if (!isUseRefHook(hook)) return

    return hook
  })()
}
