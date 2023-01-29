import { globals } from '../globals';
// import { rerender } from '../render/renderer';
import { benchmark } from '../utils/benchmark';
import { initialiseHook } from './initialiseHook';

type SetValue<TState> = (state: TState | ((prev: TState) => TState)) => void;

export const useState = <TState>(
  initialValue: TState
): [TState, SetValue<TState>] => {
  // const { cache, stateIndex, componentId } = initialiseHook();
  // if (!cache[stateIndex]) cache[stateIndex] = initialValue;
  // const setValue = (state: TState | ((prev: TState) => TState)) => {
  //   if (state instanceof Function) {
  //     cache[stateIndex] = state(cache[stateIndex] as TState);
  //   } else {
  //     cache[stateIndex] = state;
  //   }
  //   benchmark(() => rerender(componentId), 'rerender');
  // };
  // const value = cache[stateIndex] as TState;
  // return [value, setValue];
};
