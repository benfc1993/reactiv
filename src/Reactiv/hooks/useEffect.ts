import { initialiseHook } from './initialiseHook'

export const useEffect = (
	callback: () => void | (() => void),
	dependencies?: unknown[]
) => {
	const { cacheIndex, cache } = initialiseHook()

	if (!cache[cacheIndex]) {
		cache[cacheIndex] = { dependencies: undefined, cleanup: null }
	}

	if (
		dependencies === undefined ||
		cache[cacheIndex].dependencies === undefined ||
		(cache[cacheIndex].dependencies as []).some(
			(dep, idx) => dep != dependencies[idx]
		)
	) {
		if (cache[cacheIndex].cleanup) cache[cacheIndex].cleanup()
		cache[cacheIndex].cleanup = callback()
		cache[cacheIndex].dependencies = dependencies
	}
}
