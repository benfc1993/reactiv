import type { NodeCache } from './types'

export const map: Map<string, NodeCache> = new Map()

export const keys: string[] = []
export const globalKey: { value: string } = { value: '' }
export const hookIndex = { value: 0 }
export const renderState = { initialRender: false, renderRunning: false }
export const renderQueue: (() => void)[] = []

export const addToRenderQueue = (callback: () => void) => {
  renderQueue.push(callback)
  if (
    renderQueue.length &&
    !renderState.initialRender &&
    !renderState.renderRunning
  )
    renderQueue.shift()?.()
}
