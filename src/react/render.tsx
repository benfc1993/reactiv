import { isComponentNode, isElementNode, type ReactivNode } from '.'
import { nodePointers, renderState } from './globalState'
import { isPrimitiveValue } from './utils'

export function render(el: ReactivNode, container: HTMLElement) {
  renderState.renderRunning = true
  if (!el) return
  let domEl: Text | HTMLElement
  // if (el.rerender) console.log(el.tag, el.rerender, el.ref, container)

  domEl =
    el.isComponent || el.tag === 'FRAGMENT'
      ? container
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
          render(node, domEl)
        })
    }
  }

  if (isComponentNode(el) || el.tag === 'FRAGMENT') {
    if (el.tag === 'FRAGMENT') {
      console.log('render FRAGMENT:', { ...el })
      console.log(el.children.flatMap((child) => child)[0].ref)
    }
    el.ref = el.children.flatMap((child) => child)[0].ref
    console.log(el.ref)
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
