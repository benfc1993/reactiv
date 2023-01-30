import { globals } from '../globals';

export const initialiseHook = <T = any>() => {
  const cacheIndex = globals.cacheIndex;
  const cache = globals.currentTreeElement.cache as T[];
  globals.incrementCurrentStateIndex();
  return {
    cacheIndex,
    cache,
    treeElement: globals.currentTreeElement
  };
};
