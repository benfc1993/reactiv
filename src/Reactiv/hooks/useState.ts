import { benchmark } from '../utils/benchmark'
import { rerender } from '../virtualDom/createTree'
import { initialiseHook } from './initialiseHook'

export type SetValue<TState> = (
	state: TState | ((prev: TState) => TState)
) => void

export const useState = <TState>(
	initialValue: TState
): [TState, SetValue<TState>] => {
	const { cache, cacheIndex, treeElement } = initialiseHook()
	if (!cache[cacheIndex]) cache[cacheIndex] = initialValue
	const setValue = (state: TState | ((prev: TState) => TState)) => {
		if (state instanceof Function) {
			cache[cacheIndex] = state(cache[cacheIndex] as TState)
		} else {
			cache[cacheIndex] = state
		}
		benchmark(() => rerender(treeElement), 'rerender')
	}
	const value = cache[cacheIndex] as TState
	return [value, setValue]
}
