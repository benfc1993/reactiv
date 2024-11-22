import React from '..'

import {
  addToRenderQueue,
  globalKey,
  nodePointers,
  scheduler,
} from '../globalState'
import { useEffect, useMemo } from '../hooks'
import { rerender } from '../rerender'
import { ReactivComponentNode, ReactivNode } from '../types'

export function createContext<TValue>(initialValue: TValue) {
  function Internal(internalProps: {
    value: TValue
    children?: Element[] | Element
    __consumers: Set<ReactivNode>
  }) {
    const { value, children, __consumers = new Set() } = internalProps

    useEffect(() => {
      __consumers.forEach((consumer) =>
        addToRenderQueue(
          () => consumer.isComponent && rerender(consumer.fn, consumer.props)
        )
      )
    }, [value])

    return <>{children}</>
  }

  function Provider(props: { value: TValue; children?: Element[] | Element }) {
    useMemo(() => {
      const cache = nodePointers.get(globalKey.value)
      if (cache) cache.props = { ...cache.props, __consumers: new Set() }
    }, [])

    useEffect(() => {
      console.log('RENDER MY CONSUMERS')
      const providerProps = nodePointers.get(globalKey.value)!
        .props as typeof props & {
        __consumers: Set<ReactivComponentNode>
      }
      providerProps.__consumers.forEach((consumer) =>
        scheduler.add(
          () => consumer.isComponent && rerender(consumer.fn, consumer.props)
        )
      )
    }, [props.value])
    return props.children
  }

  return { Provider }
}
