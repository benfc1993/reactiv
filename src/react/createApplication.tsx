import React from '.'
import { commitTree } from '../devTools'
import {
  renderState,
  globalKey,
  hookIndex,
  map,
  renderQueue,
  getVDomRoot,
} from './globalState'
import { render } from './render'
import { ReactivNode } from './types'

export function createApplication(
  root: HTMLElement,
  RootComponent: () => JSX.Element
) {
  renderState.initialRender = true
  render((<RootComponent />) as unknown as ReactivNode, root)
  renderState.initialRender = false
  globalKey.value = ''
  hookIndex.value = 0
  commitTree()
  if (renderQueue.length) renderQueue.shift()?.()
  renderState.renderRunning = false
  console.log('Virtual Dom: ', getVDomRoot())
}
