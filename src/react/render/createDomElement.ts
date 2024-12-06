import { render } from './render'
import { isComponentNode, ReactivNode } from '../types'

export function createDomElement(
  el: ReactivNode,
  container: HTMLElement | DocumentFragment
) {
  if (!el) return null

  let domEl: HTMLElement | DocumentFragment | Text | null
  switch (true) {
    case !el.dirty:
      domEl = el.tag === 'FRAGMENT' || isComponentNode(el) ? container : el.ref
      break
    case el.tag === 'FRAGMENT' || isComponentNode(el):
      domEl = document.createDocumentFragment()
      break
    case el.tag === 'TEXT':
      domEl = document.createTextNode(el.props.value)
      break
    default:
      domEl = document.createElement(el.tag)
      break
  }

  if (!domEl) return domEl

  if (!(domEl instanceof Text)) {
    if (!el.isComponent) {
      if (el.props && 'ref' in el.props && 'current' in el.props.ref) {
        el.props.ref.current = domEl
      }
      if (!(domEl instanceof DocumentFragment)) {
        if (el.props && 'className' in el.props && el.props.className !== '') {
          domEl.classList.add(el.props.className.split(' '))
        }

        let elProps = el.props ? Object.keys(el.props) : null
        if (elProps && elProps.length > 0) {
          elProps.forEach((prop) => {
            if (prop === 'className' || prop === 'key') return
            if (!el.isComponent && prop.startsWith('on')) {
              domEl[prop as keyof GlobalEventHandlers] = el.props[prop]
              return
            }

            domEl.setAttribute(prop, el.props[prop])
          })
        }
      }
    }
  }

  if (domEl instanceof Text) return domEl

  itterateChildren(el, (child) => {
    render(child, domEl)
  })

  return domEl
}

export function itterateChildren(
  parent: ReactivNode,
  callback: (node: ReactivNode) => void
) {
  let current: ReactivNode | null = parent.child
  while (current) {
    callback(current)
    current = current.sibling
  }
}
