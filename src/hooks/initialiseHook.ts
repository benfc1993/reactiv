import { globals } from '../globals/globals';

export const initialiseHook = <T = any>() => {
  const componentId = globals.parentId;
  const stateIndex = globals.currentStateIndex;
  const cache = globals.componentElements[componentId].cache as T[];
  globals.incrementCurrentStateIndex();
  return {
    componentId,
    stateIndex,
    cache
  };
};
