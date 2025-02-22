import { ReactivComponentNode } from '../react'
import { Action, addAction } from './step'

export async function logStateAction(
  cache: ReactivComponentNode,
  prevValue: unknown,
  nextValue: unknown
) {
  return addAction(
    cache,
    Action.STATE_CHANGE,
    `State updated from ${prevValue instanceof Object ? JSON.stringify(prevValue) : prevValue} to ${prevValue instanceof Object ? JSON.stringify(nextValue) : nextValue}`,
    true
  )
}

export async function logEffectAction(cache: ReactivComponentNode) {
  console.log('useEffect')
  return addAction(
    cache,
    Action.DEPENDENCY_CHANGE,
    'useEffect dependencies changed, running callback',
    true
  )
}
