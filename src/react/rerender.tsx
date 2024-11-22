import React from '.'
import { commitTree, showAllMessages } from '../devTools'
import {
  nodePointers,
  globalKey,
  hookIndex,
  renderQueue,
  renderState,
} from './globalState'
import { reconcile } from './reconciliation/reconcile'
import { render } from './render'
import { ReactivNode } from './types'

export async function rerender(
  Component: (...args: any[]) => any,
  props: Record<string, any>
) {
  renderState.renderRunning = true
  const state = nodePointers.get(props.key)
  if (!state) return

  hookIndex.value = 0
  reconcile(
    state,
    (<Component {...props} key={state.props.key} />) as unknown as ReactivNode
  )
  globalKey.value = ''

  if (renderQueue.length > 0) {
    return renderQueue.shift()?.()
  }
  commitTree()
  render(state, state.ref?.parentElement!)
  renderState.renderRunning = false
  console.log(nodePointers)
  showAllMessages()
}
