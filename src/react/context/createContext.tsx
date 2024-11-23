import { ReactivNode } from '../types'

export const initialContextValues = new Map()

export function createContext<TValue>(initialValue: TValue) {
  initialContextValues.set(Provider, initialValue)

  function Provider(props: {
    value: TValue
    children?: ReactivNode[] | ReactivNode
  }) {
    return props.children
  }

  return { Provider }
}
