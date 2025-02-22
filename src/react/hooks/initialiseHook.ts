import { globalKey, hookIndex } from '../globalState'

export function initialiseHook() {
  const idx = hookIndex.value
  const internalKey = globalKey.value
  hookIndex.value += 1

  return { idx, internalKey }
}
