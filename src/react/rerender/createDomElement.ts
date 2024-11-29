import { render } from '../render'
import { ReactivNode } from '../types'

export function createDomElement(
  el: ReactivNode,
  container: HTMLElement | DocumentFragment
) {
  let domEl: Text | HTMLElement | DocumentFragment = el.isComponent
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
      if (!(domEl instanceof DocumentFragment)) {
        if (el.props && 'className' in el.props && el.props.className !== '') {
          domEl.classList.add(el.props.className.split(' '))
        }

        let elProps = el.props ? Object.keys(el.props) : null
        if (elProps && elProps.length > 0 && el.tag !== 'TEXT') {
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

  return domEl
}
