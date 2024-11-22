import React from '..'

import { addToRenderQueue } from '../globalState'
import { useEffect } from '../hooks'
import { rerender } from '../rerender'
import { ReactivNode } from '../types'

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
    return (
      <Internal
        __consumers={new Set()}
        value={props.value}
        children={props.children}
      />
    )
  }

  return { Provider }
}
