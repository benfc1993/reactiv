import { isComponentNode, isElementNode, type ReactivNode } from '.'
import { nodePointers, renderState } from './globalState'
import { isPrimitiveValue } from './utils'

export function render(el: ReactivNode, container: HTMLElement) {
  renderState.renderRunning = true
  if (!el) return
  let domEl: Text | HTMLElement

  domEl = el.isComponent
    ? container
    : el.tag === 'FRAGMENT'
      ? document.createDocumentFragment()
      : !el.rerender && el.ref
        ? el.ref
        : el.tag === 'TEXT'
          ? document.createTextNode(el.props.value)
          : document.createElement(el.tag)

  if (!(domEl instanceof Text)) {
    if (!el.isComponent) {
      if (el.props && 'ref' in el.props && 'current' in el.props.ref) {
        el.props.ref.current = domEl
      }

      if (el.props && 'className' in el.props && el.props.className !== '') {
        domEl.classList.add(el.props.className.split(' '))
      }

      let elProps = el.props ? Object.keys(el.props) : null
      if (elProps && elProps.length > 0 && el.tag !== 'TEXT') {
        elProps.forEach((prop) => {
          if (prop === 'className') return
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
          render(
            node,
            !el.rerender && el.tag === 'FRAGMENT' ? container : domEl
          )
        })
    }
  }

  if (isComponentNode(el)) {
    el.ref = el.children.flatMap((child) => child)[0].ref
    el.rerender = false
    return
  }

  if (el.rerender) {
    el.rerender = false
    if (
      !(container instanceof DocumentFragment) &&
      !el.isComponent &&
      el.ref &&
      container.contains(el.ref)
    ) {
      container.replaceChild(domEl, el.ref)
    } else {
      container.appendChild(domEl)
    }
  }
  if (el.tag === 'FRAGMENT') {
    el.ref = el.children.flatMap((child) => child)[0]?.ref
    return
  }

  el.ref = domEl
}
