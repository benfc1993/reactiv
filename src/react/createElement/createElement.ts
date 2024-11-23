import { addToDevTree, commitNode, Action } from '../../devTools'
import {
  hookIndex,
  nodePointers,
  globalKey,
  getVDomRoot,
  setVDomRoot,
} from '../globalState'
import { renderState } from '../globalState'
import { ReactivElementNode, ReactivNode } from '../types'
import { createBlankReactivComponentNode } from './createReactivNode'
import { sanitiseChildren } from './sanitiseChildren'
import { sanitiseElementProps } from './sanitiseProps'

const React = {
  createElement: (
    tag: string | ((...args: any[]) => ReactivNode),
    props: Record<string, any>,
    ...children: ReactivNode[]
  ): ReactivNode => {
    if (typeof tag === 'function') {
      const key = props?.key ?? Math.random().toString()
      const el = createBlankReactivComponentNode(key, tag, props, children)

      hookIndex.value = 0
      globalKey.value = key

      if (getVDomRoot() === null) setVDomRoot(el)

      if (!renderState.initialRender) {
        return el
      }

      addToDevTree(key, tag.name, Action.ADDED_COMPONENT)

      nodePointers.set(key, el)

      const componentResponse = tag(el.props)

      el.children = sanitiseChildren(
        Array.isArray(componentResponse)
          ? (componentResponse as Array<ReactivNode>)
          : [componentResponse]
      )

      commitNode()

      return el
    }
    const el: ReactivElementNode = {
      tag: tag ?? 'FRAGMENT',
      isComponent: false,
      props: sanitiseElementProps(props),
      children: sanitiseChildren(children),
      ref: null,
      rerender: true,
    }

    return el
  },
}
export default React
