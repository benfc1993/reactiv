import { globals, TreeNode } from '../globals'
import { initialiseHook } from '../hooks/initialiseHook'
import { getNearestElementByType } from '../virtualDom/getNearestElementByType'
import { Component } from '../types'
import { loudLog } from '../utils/loudLog'
import { useEffect } from '../hooks/useEffect'

type ContextProvider<T> = Component<{ value: T }>

type Context<T> = {
	Provider: ContextProvider<T>
}

export const createContext = <T,>(): Context<T> => {
	const Provider: Component<{ value: T }> = (props) => {
		const { children } = props

		useEffect(
			() =>
				(globals.currentTreeNode.cache[0] =
					typeof props.value === 'function' ? props.value() : props.value),
			[props]
		)
		return <>{children}</>
	}

	return {
		Provider
	}
}

type ContextCache<T> = {
	treeElement: TreeNode | null
	value: T
}

export const useContext = <T,>(Context: Context<T>): T => {
	const { treeElement, cacheIndex, cache } = initialiseHook<ContextCache<T>>()
	const contextElement = getNearestElementByType(treeElement, Context.Provider)
	loudLog('getNearestElement', treeElement)
	if (contextElement === null)
		throw new Error(
			'Component must be child of Target Provider to use "useContext"'
		)

	cache[cacheIndex] = {
		treeElement: contextElement,
		value: contextElement.cache[0] as T
	}

	return cache[cacheIndex].value
}
