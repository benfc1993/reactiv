import { ReactNode } from 'react'

export const initialContextValues = new Map()

export function createContext<TValue>(initialValue: TValue) {
  initialContextValues.set(Provider, initialValue)

  function Provider(props: { value: TValue; children?: ReactNode }) {
    initialContextValues.set(Provider, props.value)
    return props.children
  }

  return { Provider }
}
