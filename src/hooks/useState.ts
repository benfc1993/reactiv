import { globals } from '../globals/globals';
import { rerender } from '../render/renderer';

type SetValue<T> = (state: T | ((prev: T) => T)) => void;

export const useState = <T>(initialValue: T): [T, SetValue<T>] => {
  const componentId = globals.currentId;
  const stateIndex = globals.currentStateIndex;
  globals.incrementCurrentStateIndex();

  const { cache } = globals.componentElements[componentId];

  if (!cache[stateIndex]) cache[stateIndex] = initialValue;
  const setValue = (state: T | ((prev: T) => T)) => {
    if (state instanceof Function) {
      cache[stateIndex] = state(cache[stateIndex] as T);
    } else {
      cache[stateIndex] = state;
    }

    rerender(componentId);
  };
  const value = cache[stateIndex] as T;
  return [value, setValue];
};
