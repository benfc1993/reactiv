import React from '.'
import { commitTree } from '../devTools'
import { init } from '../devTools/ui'
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
import { render } from './render/render'
import { ReactivComponentNode, ReactivNode } from './types'

export function createApplication(
  root: HTMLElement,
  RootComponent: () => JSX.Element
) {
  init()
  renderState.initialRender = true
  scheduler.add(() => {
    setVDomRoot({
      tag: root.tagName,
      ref: root,
      child: (<RootComponent />) as unknown as ReactivComponentNode,
      sibling: null,
      dirty: false,
      isComponent: false,
      props: {},
    })
    console.log(getVDomRoot())
    const vDomRoot = getVDomRoot()
    if (!vDomRoot?.child) return
    render(vDomRoot.child, root)
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
