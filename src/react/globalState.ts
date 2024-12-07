import type { ReactivComponentNode, ReactivNode } from './types'

export const nodePointers: Map<string, ReactivComponentNode | null> = new Map()

export const keys: string[] = []
export const globalKey: { value: string } = { value: '' }
export const hookIndex = { value: 0 }
export const renderState = { initialRender: false, renderRunning: false }
export const renderQueue: (() => void)[] = []
const vDom: { root: ReactivNode | null } = { root: null }
type Scheduler = {
  _queue: (() => void)[]
  add: (callback: () => void) => void
  run: () => void
  _running: boolean
}

const reconciliationSubscribers: Set<() => void> = new Set()
export function subscribeToReconciliationCompletion(
  callback: () => void
): () => void {
  reconciliationSubscribers.add(callback)
  return () => reconciliationSubscribers.delete(callback)
}
export function reconciliationComplete() {
  reconciliationSubscribers.forEach((sub) => sub())
}

export const scheduler: Scheduler = {
  _queue: [],
  _running: false,
  add(callback: () => void) {
    this._queue.push(() => {
      callback()
      if (this._queue.length > 0) {
        this._queue.shift()?.()
        return
      }

      if (this._queue.length <= 0) this._running = false
    })
    if ((this._queue.length = 1)) this.run()
  },
  run() {
    if (this._running) return
    this._running = true
    this._queue.shift()?.()
  },
}

export const suspended = new Set<() => void>()

export function setVDomRoot(rootNode: ReactivNode) {
  vDom.root = rootNode
}

export function getVDomRoot() {
  return vDom.root
}

export const addToRenderQueue = (callback: () => void) => {
  renderQueue.push(callback)
  if (
    renderQueue.length &&
    !renderState.initialRender &&
    !renderState.renderRunning
  )
    renderQueue.shift()?.()
}
