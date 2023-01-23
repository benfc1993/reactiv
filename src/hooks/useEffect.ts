import { globalParent } from "../renderer";

const passedState: Record<string, any[]> = {};

export const useEffect = (
  callback: () => void | (() => void),
  dependencies: unknown[]
) => {
  const parent = globalParent;
  const prevDeps = passedState[parent];
  if (
    !passedState[parent] ||
    prevDeps.some((dep, idx) => dep != dependencies[idx])
  ) {
    callback();
    passedState[parent] = dependencies;
  }
};
