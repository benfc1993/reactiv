import {
  componentElements,
  currentId,
  currentStateIndex,
  incrementCurrentStateIndex,
  rerender
} from '../renderer';

type SetValue<T> = (state: T | ((prev: T) => T)) => void;

export const useState = <T>(initialValue: T): [T, SetValue<T>] => {
  const componentId = currentId;
  const stateIndex = currentStateIndex;
  incrementCurrentStateIndex();

  const { cache } = componentElements[componentId];

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
