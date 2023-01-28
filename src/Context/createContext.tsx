// import { globals } from '../globals/globals';
// import { initialiseHook } from '../hooks/initialiseHook';
// import { getNearestComponentByType } from '../render/renderer';
// import { Reactiv } from '../types';

// type ContextProvider<T> = Reactiv.Component<{ value: T }>;

// type Context<T> = {
//   Provider: ContextProvider<T>;
// };

// export const createContext = <T,>(intialValue: T): Context<T> => {
//   const Provider: Reactiv.Component<{ value: T }> = (
//     props = { value: intialValue }
//   ) => {
//     return <>{props.children}</>;
//   };
//   return {
//     Provider
//   };
// };

// type ContextCache<T> = {
//   contextElementId: string;
//   nextId: string;
//   value: T;
// };

// export const useContext = <T,>(Context: Context<T>): T => {
//   const { stateIndex, componentId, cache } = initialiseHook<ContextCache<T>>();
//   if (globals.componentElements[componentId].parentId === '') {
//     cache[stateIndex] = Context.Provider;
//     return null;
//   }
//   let contextElement;
//   if (!cache[stateIndex]) {
//     contextElement = getNearestComponentByType(componentId, Context.Provider);
//   } else {
//     contextElement =
//       globals.componentElements[cache[stateIndex].contextElementId];
//   }

//   cache[stateIndex] = {
//     contextElementId: contextElement!.id,
//     nextId: contextElement!.nodeTree.nextHash,
//     value: contextElement!.props.value
//   };

//   return cache[stateIndex].value;
// };
