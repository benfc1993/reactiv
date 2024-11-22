import { elementEvents } from '../elementEvents'

export function sanitiseComponentProps(props?: Record<string, any>) {
  if (!props) return {}
  return Object.entries(props).reduce(
    (nextProps: Record<string, any>, [key, value]) => {
      if (key === 'children') {
      }
      nextProps[key] = value
      return nextProps
    },
    {}
  )
}

export function sanitiseElementProps(props?: Record<string, any>) {
  if (!props) return {}
  return Object.entries(props).reduce(
    (nextProps: Record<string, any>, [key, value]) => {
      if (elementEvents.includes(key.toLowerCase())) {
        nextProps[key.toLowerCase()] = value
        return nextProps
      }

      if (typeof value === 'function') {
        nextProps[key] = value()
        return nextProps
      }

      if (key === 'style' && value instanceof Object) {
        nextProps[key.toLowerCase()] = Object.entries(value)
          .map(([styleKey, styleValue]) => {
            const correctedStyleKey = styleKey.replace(
              /([A-Z])/g,
              (match) => `-${match.toLowerCase()}`
            )
            const calculatedValue =
              typeof styleValue === 'function' ? styleValue() : styleValue
            if (!isNaN(Number(calculatedValue))) {
              return `${correctedStyleKey}:${calculatedValue}px`
            }
            return `${correctedStyleKey}:${calculatedValue}`
          })
          .join(';')
        return nextProps
      }

      nextProps[key] = value
      return nextProps
    },
    {}
  )
}
