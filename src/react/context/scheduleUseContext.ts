import { scheduler } from '../globalState'

export function scheduleUseContext(callback: () => void) {
  scheduler.add(callback)
}
