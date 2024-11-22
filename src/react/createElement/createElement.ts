import { addToDevTree, commitNode, Action } from '../../devTools'
import {
  hookIndex,
  map,
  globalKey,
  getVDomRoot,
  setVDomRoot,
} from '../globalState'
import { renderState } from '../globalState'
import { ReactivElementNode, ReactivNode } from '../types'
import { createBlankReactivComponentNode } from './createReactivNode'
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

      const cache = map.get(key)

      hookIndex.value = 0
      globalKey.value = key

      if (getVDomRoot() === null) setVDomRoot(el)

      if (!renderState.initialRender) {
        return el
      }

      addToDevTree(key, tag.name, Action.ADDED_COMPONENT)

      map.set(key, {
        ...cache,
        key,
        props: el.props,
        el,
        hooks: [],
        component: el.fn,
      })

      const componentResponse = tag(el.props)

      el.children = Array.isArray(componentResponse)
        ? (componentResponse as Array<ReactivNode>)
        : [componentResponse]

      commitNode()

      return el
    }
    const el: ReactivElementNode = {
      tag,
      isComponent: false,
      props: sanitiseElementProps(props),
      children,
      ref: null,
      rerender: true,
    }

    return el
  },
}
export default React
