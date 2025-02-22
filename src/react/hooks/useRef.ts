import { nodePointers } from '../globalState'
import { isUseRefHook } from '../types'
import { initialiseHook } from './initialiseHook'

export function useRef<TValue>(initialValue: TValue): { current: TValue } {
  const { idx, internalKey } = initialiseHook()

  return (() => {
    const cache = nodePointers.get(internalKey)

    if (!cache) throw new Error('Cache not found for useRef')
    if (!cache?.hooks[idx]) {
      cache.hooks[idx] = { current: initialValue }
    }
    const hook = cache.hooks[idx]
    if (!isUseRefHook(hook)) return { current: undefined }

    return hook
  })()
}
