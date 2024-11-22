import type { ReactivNode } from '.'
import { map, renderState } from './globalState'
import { isPrimitiveValue } from './utils'

export function render(el: ReactivNode, container: HTMLElement) {
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
      : !el.rerender && el.ref
        ? el.ref
        : document.createElement(el.tag)

  if (el.props && 'key' in el.props) {
    const state = map.get(el.props.key)
    if (state?.el) {
      state.el.ref = domEl
    }
  }

  if (!el.isComponent) {
    if (el.props && 'ref' in el.props && 'current' in el.props.ref) {
      el.props.ref.current = domEl
    }

    if (el.props && 'className' in el.props && el.props.className !== '') {
      domEl.classList.add(el.props.className.split(' '))
    }

    let elProps = el.props ? Object.keys(el.props) : null
    if (elProps && elProps.length > 0) {
      elProps.forEach((prop) => {
        if (!el.isComponent && prop.startsWith('on')) {
          domEl[prop as keyof GlobalEventHandlers] = el.props[prop]
          return
        }

        domEl.setAttribute(prop, el.props[prop])
      })
    }
  }
  if (el.children && el.children.length > 0) {
    el.children
      .flatMap((child) => child)
      .forEach((node) => {
        if (isPrimitiveValue(node) && !el.rerender) return
        render(node, domEl)
      })
  }
  if (el.isComponent || el.tag === 'FRAGMENT') {
    el.ref = el.children[0].ref
    el.rerender = false
    return
  }
  if (el.rerender) {
    el.rerender = false
    if (!el.isComponent && el.ref && container.contains(el.ref)) {
      container.replaceChild(domEl, el.ref)
    } else {
      container.appendChild(domEl)
    }
  }
  el.ref = domEl
}
