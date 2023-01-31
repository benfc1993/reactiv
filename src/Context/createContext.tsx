import { TreeNode, globals } from '../globals';
import { initialiseHook } from '../hooks/initialiseHook';
import { getNearestElementByType } from '../virtualDom/getNearestElementByType';
import { Attributes, Reactiv } from '../types';
import { loudLog } from '../utils/loudLog';

type ContextProvider<T> = Reactiv.Component<{ value: T }>;

type Context<T> = {
  Provider: ContextProvider<T>;
};

export const createContext = <T,>(intialValue?: T): Context<T> => {
  const Provider: Reactiv.Component<{ value: T }> = (props) => {
    if (intialValue)
      props.value =
        typeof intialValue === 'function' ? intialValue() : intialValue;
    return <>{props.children}</>;
  };

  return {
    Provider
  };
};

type ContextCache<T> = {
  treeElement: TreeNode | null;
  value: T;
};

export const useContext = <T,>(Context: Context<T>): T => {
  const { treeElement, cacheIndex, cache } = initialiseHook<ContextCache<T>>();
  let contextElement;
  if (!cache[cacheIndex]) {
    contextElement = getNearestElementByType(treeElement, Context.Provider);
    loudLog('getNearestElement', treeElement);
  } else {
    contextElement = cache[cacheIndex].treeElement;
  }
  if (contextElement === null)
    throw new Error(
      "Component must be child of Target Provider to use 'useContext'"
    );

  cache[cacheIndex] = {
    treeElement: contextElement,
    value: contextElement!.props.value
  };

  return cache[cacheIndex].value;
};
