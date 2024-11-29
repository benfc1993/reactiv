import { isComponentNode, type ReactivNode } from '.'
import { renderState } from './globalState'
import { createDomElement } from './rerender/createDomElement'

export function render(
  el: ReactivNode,
  container: HTMLElement | DocumentFragment
) {
  renderState.renderRunning = true
  if (!el) return
  let domEl: Text | HTMLElement | DocumentFragment

  domEl = createDomElement(el, container)

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
  if (domEl instanceof DocumentFragment) {
    el.ref = el.children.flatMap((child) => child)[0]?.ref
    return
  }

  el.ref = domEl
}
