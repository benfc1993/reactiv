import { globals } from '../globals/globals';
import { rerender } from '../render/renderer';

type SetValue<TState> = (state: TState | ((prev: TState) => TState)) => void;

export const useState = <TState>(
  initialValue: TState
): [TState, SetValue<TState>] => {
  const componentId = globals.currentId;
  const stateIndex = globals.currentStateIndex;
  globals.incrementCurrentStateIndex();

  const { cache } = globals.componentElements[componentId];

  if (!cache[stateIndex]) cache[stateIndex] = initialValue;
  const setValue = (state: TState | ((prev: TState) => TState)) => {
    if (state instanceof Function) {
      cache[stateIndex] = state(cache[stateIndex] as TState);
    } else {
      cache[stateIndex] = state;
    }

    rerender(componentId);
  };
  const value = cache[stateIndex] as TState;
  return [value, setValue];
};
