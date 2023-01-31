import { globals } from '../globals';
import { initialiseHook } from './initialiseHook';

export const useRef = <TValue>(initialValue: TValue): { current: TValue } => {
  const { cacheIndex, cache } = initialiseHook();

  if (!cache[cacheIndex]) {
    cache.push({ current: initialValue });
  }

  return cache[cacheIndex];
};
