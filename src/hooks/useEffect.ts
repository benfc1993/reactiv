import { globals } from '../globals';
import { initialiseHook } from './initialiseHook';

export const useEffect = (
  callback: () => void | (() => void),
  dependencies?: unknown[]
) => {
  const { stateIndex, cache } = initialiseHook();

  if (!cache[stateIndex]) {
    cache[stateIndex] = { dependencies: undefined, cleanup: null };
  }

  if (
    dependencies === undefined ||
    cache[stateIndex].dependencies === undefined ||
    (cache[stateIndex].dependencies as []).some(
      (dep, idx) => dep != dependencies[idx]
    )
  ) {
    if (cache[stateIndex].cleanup) cache[stateIndex].cleanup();
    cache[stateIndex].cleanup = callback();
    cache[stateIndex].dependencies = dependencies;
  }
};
