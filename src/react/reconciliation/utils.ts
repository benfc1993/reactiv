import { ReactivNode } from '../types'
import { isPrimitiveValue } from '../utils'

export function isNullChild(child: ReactivNode) {
  return (
    (child?.props?.value === false || child?.props?.value === null) &&
    child?.tag === 'TEXT'
  )
}

export function propDif(a: ReactivNode, b: ReactivNode) {
  if (a.props === b.props) return false
  if (!a?.props && !b?.props) return false
  if (!a?.props && b?.props) return true
  if (a?.props && !b?.props) return true
  return Object.entries(a.props).some(([key, value]) => {
    if (!isPrimitiveValue(value)) return false
    return b.props[key] !== value
  })
}
