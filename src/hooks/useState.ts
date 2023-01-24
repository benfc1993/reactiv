import { globalParent, rerender } from '../renderer';

let values: Record<string, any> = {};

type SetValue<T> = (state: T | ((prev: T) => T)) => void;

export const useState = <T>(initialValue: T): [T, SetValue<T>, string] => {
  const parent = globalParent;

  if (!values[parent]) values[parent] = initialValue;
  const setValue = (state: T | ((prev: T) => T)) => {
    if (state instanceof Function) {
      values[parent] = state(values[parent]);
    } else {
    }

    rerender(parent);
  };
  return [values[parent], setValue, parent];
};
