import React from '.'
import { commitTree, showAllMessages } from '../devTools'
import {
  map,
  globalKey,
  hookIndex,
  renderQueue,
  renderState,
  getVDomRoot,
} from './globalState'
import { reconcile } from './reconciliation/reconcile'
import { render } from './render'
import { ReactivNode } from './types'

export async function rerender(
  Component: (...args: any[]) => any,
  props: Record<string, any>
) {
  renderState.renderRunning = true
  const state = map.get(props.key)
  if (!state || !state.el) return

  hookIndex.value = 0
  reconcile(
    state.el,
    (<Component {...props} key={state.props.key} />) as unknown as ReactivNode
  )
  globalKey.value = ''

  if (renderQueue.length > 0) {
    return renderQueue.shift()?.()
  }
  commitTree()
  render(state.el, state.el.ref?.parentElement!)
  renderState.renderRunning = false
  console.log(map)
  showAllMessages()
}
