import { globals } from '../globals/globals';

export const useRef = <TValue>(initialValue: TValue): { current: TValue } => {
  const { currentId, currentStateIndex } = globals;
  const { cache } = globals.componentElements[currentId];
  if (!cache[currentStateIndex]) {
    cache.push({ current: initialValue });
  }
  globals.incrementCurrentStateIndex();

  return cache[currentStateIndex];
};
