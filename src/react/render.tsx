import type { ReactNode } from '.'
import { commitTree } from '../devTools'
import {
  globalKey,
  hookIndex,
  map,
  renderQueue,
  renderState,
} from './globalState'

export function createApplication(
  root: HTMLElement,
  RootComponent: () => ReactNode
) {
  renderState.initialRender = true
  render(RootComponent(), root)
  renderState.initialRender = false
  globalKey.value = undefined
  hookIndex.value = 0
  console.log(map)
  commitTree()
  if (renderQueue.length) renderQueue.shift()()
  renderState.renderRunning = false
}

export function render(el: ReactNode, container: HTMLElement) {
  renderState.renderRunning = true
  if (!el) return
  let domEl: Text | HTMLElement

  if (typeof el === 'string' || typeof el === 'number') {
    domEl = document.createTextNode(el)
    container.appendChild(domEl)
    return
  }

  domEl =
    el.isComponent || el.tag === 'FRAGMENT'
      ? container
      : document.createElement(el.tag)
  if (el.props && 'key' in el.props) {
    const state = map.get(el.props.key)
    if (state) {
      state.el.ref = domEl
      domEl.setAttribute('data-key', state.key)
    }
  }

  if (!el.isComponent) {
    if (el.props && 'ref' in el.props && 'current' in el.props.ref) {
      el.props.ref.current = domEl
    }

    if (el.props && 'className' in el.props) {
      domEl.classList.add(el.props.className.split(' '))
    }

    let elProps = el.props ? Object.keys(el.props) : null
    if (elProps && elProps.length > 0) {
      elProps.forEach((prop) => (domEl[prop] = el.props[prop]))
    }
  }
  if (el.children && el.children.length > 0) {
    el.children.flatMap((child) => child).forEach((node) => render(node, domEl))
  }
  if (el.isComponent || el.tag === 'FRAGMENT') {
    el.ref = el.children[0].ref
    return
  }

  if (!el.isComponent && el.ref && container.contains(el.ref)) {
    container.replaceChild(domEl, el.ref)
  } else {
    container.appendChild(domEl)
  }
  el.ref = domEl
}
