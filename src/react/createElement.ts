import { addToDevTree, commitNode, Action } from '../devTools'
import { elementEvents } from './elementEvents'
import { keys, hookIndex, map, globalKey } from './globalState'
import { renderState } from './globalState'
import { ReactNode } from './types'

export const React = {
  createElement: (
    tag: string | ((...args: any[]) => ReactNode),
    props: Record<string, any>,
    ...children: ReactNode[]
  ) => {
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
          ? Object.entries(props).reduce((nextProps, [key, value]) => {
              if (typeof value === 'function') {
                nextProps[key] = value()
                return nextProps
              }
              nextProps[key] = value
              return nextProps
            }, {})
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
      const res: ReactNode = {
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

      map.get(componentKey).el = res
      return res
    }

    const el: ReactNode = {
      tag: tag ?? 'fragment',
      props: props
        ? Object.entries(props).reduce((nextProps, [key, value]) => {
            if (elementEvents.includes(key.toLowerCase())) {
              nextProps[key.toLowerCase()] = value
              return nextProps
            }

            nextProps[key] = value
            return nextProps
          }, {})
        : props,
      children,
      isComponent: false,
      ref: null,
    }

    return el
  },
}
export default React
