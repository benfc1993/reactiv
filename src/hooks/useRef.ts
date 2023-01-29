import { globals } from '../globals';
import { initialiseHook } from './initialiseHook';

export const useRef = <TValue>(initialValue: TValue): { current: TValue } => {
  const { stateIndex, cache } = initialiseHook();

  if (!cache[stateIndex]) {
    cache.push({ current: initialValue });
  }

  return cache[stateIndex];
};
