import React from '.'
import { commitTree } from '../devTools'
import {
  renderState,
  globalKey,
  hookIndex,
  nodePointers,
  renderQueue,
  getVDomRoot,
  scheduler,
  setVDomRoot,
} from './globalState'
import { render } from './render'
import { ReactivNode } from './types'

export function createApplication(
  root: HTMLElement,
  RootComponent: () => JSX.Element
) {
  renderState.initialRender = true
  scheduler.add(() => {
    setVDomRoot({
      tag: root.tagName,
      ref: root,
      children: [<RootComponent />],
      rerender: false,
      isComponent: false,
      props: {},
    })
    render(getVDomRoot().children[0], root)
  })

  renderState.initialRender = false
  globalKey.value = ''
  hookIndex.value = 0
  commitTree()
  if (renderQueue.length) renderQueue.shift()?.()
  renderState.renderRunning = false
  console.log('Virtual Dom: ', getVDomRoot())
  console.log(nodePointers)
}
