import { addToDevTree, commitNode, Action } from '../devTools'
import { elementEvents } from './elementEvents'
import { keys, hookIndex, map, globalKey } from './globalState'
import { renderState } from './globalState'
import { ReactivNode } from './types'

export const React = {
  createElement: (
    tag: string | ((...args: any[]) => ReactivNode),
    props: Record<string, any>,
    ...children: ReactivNode[]
  ): ReactivNode => {
    if (typeof tag === 'function') {
      if (!renderState.initialRender) {
        const key = props?.key ? props.key : Math.random().toString()
        globalKey.value = key

        const el = {
          tag: tag.name,
          fn: tag,
          isComponent: true,
          props: { ...props, key },
          children,
          ref: null,
        }
        return el
      }

      keys.unshift(props?.key ? props.key : Math.random().toString())
      hookIndex.value = 0
      const state = map.get(keys[0]) ?? {
        component: tag,
        props: props
          ? Object.entries(props).reduce(
              (nextProps: Record<string, any>, [key, value]) => {
                if (typeof value === 'function') {
                  nextProps[key] = value()
                  return nextProps
                }
                nextProps[key] = value
                return nextProps
              },
              {}
            )
          : props,
        hooks: [],
        parentEl: null,
        key: keys[0],
      }

      addToDevTree(keys[0], tag.name, Action.ADDED_COMPONENT)
      map.set(keys[0], {
        ...state,
        props: { ...props, key: keys[0] },
        el: null,
        key: keys[0],
      })

      globalKey.value = keys[0]
      const componentResult = tag(
        { ...state.props, key: globalKey.value },
        ...children
      )
      const componentKey = keys.shift()
      const res: ReactivNode = {
        tag: tag.name,
        fn: tag,
        isComponent: true,
        props: { ...props, key: componentKey },
        children:
          componentResult instanceof Array
            ? componentResult
            : [componentResult],
        ref: null,
      }

      commitNode()

      if (componentKey) {
        const cache = map.get(componentKey)
        if (cache) cache.el = res
      }

      return res
    }

    const el: ReactivNode = {
      tag: tag ?? 'FRAGMENT',
      props: props
        ? Object.entries(props).reduce(
            (nextProps: Record<string, any>, [key, value]) => {
              if (elementEvents.includes(key.toLowerCase())) {
                nextProps[key.toLowerCase()] = value
                return nextProps
              }

              if (key === 'style' && value instanceof Object) {
                nextProps[key.toLowerCase()] = Object.entries(value)
                  .map(([styleKey, styleValue]) => {
                    const correctedStyleKey = styleKey.replace(
                      /([A-Z])/g,
                      (match) => `-${match.toLowerCase()}`
                    )
                    if (!isNaN(Number(styleValue))) {
                      return `${correctedStyleKey}:${styleValue}px`
                    }
                    return `${correctedStyleKey}:${styleValue}`
                  })
                  .join(';')
                return nextProps
              }

              nextProps[key] = value
              return nextProps
            },
            {}
          )
        : props,
      children,
      isComponent: false,
      ref: null,
    }

    return el
  },
}
export default React
