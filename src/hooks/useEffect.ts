import { globals } from '../globals/globals';

export const useEffect = (
  callback: () => void | (() => void),
  dependencies: unknown[]
) => {
  const componentId = globals.currentId;
  const stateIndex = globals.currentStateIndex;
  globals.incrementCurrentStateIndex();

  const { cache } = globals.componentElements[componentId];

  if (!cache[stateIndex]) {
    cache[stateIndex] = { dependencies: undefined, cleanup: null };
  }

  if (
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
