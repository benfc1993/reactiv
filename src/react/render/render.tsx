import { isComponentNode, type ReactivNode } from '..'
import { renderState } from '../globalState'
import { createDomElement } from './createDomElement'

export function render(
  el: ReactivNode,
  container: HTMLElement | DocumentFragment
) {
  renderState.renderRunning = true
  if (!el) return
  let domEl: Text | HTMLElement | DocumentFragment | null

  domEl = createDomElement(el, container)
  if (!domEl) return

  if (el.dirty || el.return()?.dirty) {
    addToDom(el, domEl, container)
    el.dirty = false
    if (!(domEl instanceof DocumentFragment)) el.ref = domEl
  }
  if (domEl instanceof DocumentFragment) {
    el.ref = findFirstElChild(el)?.ref ?? null
    return
  }
}

function findFirstElChild(node: ReactivNode) {
  let child = node.child
  if (!child?.child) return null
  console.log('continue')
  while ((child.tag === 'FRAGMENT' || isComponentNode(child)) && child.child) {
    console.log(child)
    child = child?.child
  }

  return child
}

function addToDom(
  node: ReactivNode,
  domEl: HTMLElement | DocumentFragment | Text,
  container: HTMLElement | DocumentFragment
) {
  if (node.ref && container.contains(node.ref)) {
    container.replaceChild(domEl, node.ref)
    return
  }

  const prev = node.prev()?.ref as Element
  if (prev) {
    if (domEl instanceof Element) {
      prev.insertAdjacentElement('afterend', domEl)
      return
    }

    if (domEl instanceof DocumentFragment) {
      const children = Array.from(domEl.children)
      children
        .reverse()
        .forEach((child) => prev.insertAdjacentElement('afterend', child))
      return
    }
  }
  container.appendChild(domEl)
}
