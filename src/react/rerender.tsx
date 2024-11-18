import React from '.'
import { commitTree, showAllMessages } from '../devTools'
import {
  map,
  globalKey,
  hookIndex,
  renderQueue,
  renderState,
} from './globalState'
import { reconcile } from './reconciliation/reconcile'
import { render } from './render'
import { ReactNode } from './types'

export async function rerender(
  Component: (...args: any[]) => ReactNode,
  props: Record<string, any>
) {
  renderState.renderRunning = true
  const state = map.get(props.key)
  hookIndex.value = 0
  reconcile(state.el, <Component {...props} key={state.props.key} />)
  globalKey.value = undefined

  if (renderQueue.length > 0) {
    return renderQueue.shift()()
  }
  render(state.el, state.el.ref.parentElement)
  renderState.renderRunning = false
  showAllMessages()
  commitTree()
}
