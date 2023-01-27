import { globals } from '../globals/globals';

export const useRef = <TValue>(initialValue: TValue): { current: TValue } => {
  const { parentId, currentStateIndex } = globals;
  const { cache } = globals.componentElements[parentId];
  if (!cache[currentStateIndex]) {
    cache.push({ current: initialValue });
  }
  globals.incrementCurrentStateIndex();

  return cache[currentStateIndex];
};
