import React from '.'
import { commitTree, showAllMessages } from '../devTools'
import {
  nodePointers,
  globalKey,
  hookIndex,
  renderQueue,
  renderState,
  getVDomRoot,
  reconciliationComplete,
} from './globalState'
// import { reconcile } from './reconciliation/reconcile'
import { reconcile, startReconcile } from './reconciliation/newReconcile'
import { render } from './render/render'
import { ReactivNode } from './types'

export async function rerender(
  Component: (...args: any[]) => any,
  props: Record<string, any>
) {
  console.log('rerender')
  renderState.renderRunning = true
  const state = nodePointers.get(props.key)
  if (!state) return

  console.log('PROPS KEY:', props.key)
  globalKey.value = props.key
  hookIndex.value = 0
  startReconcile(
    state,
    (<Component {...props} key={state.props.key} />) as unknown as ReactivNode
  )
  reconciliationComplete()
  globalKey.value = ''

  console.log('reconciled')
  commitTree()

  render(state, state.ref?.parentElement!)
  if (renderQueue.length > 0) {
    console.log('next in render queue')
    return renderQueue.shift()?.()
  }
  renderState.renderRunning = false
  showAllMessages()
  console.log(getVDomRoot())
}
