import { TreeElement } from '../globals';
import { Reactiv } from '../types';

export const getNearestElementByType = <T extends Reactiv.Component>(
  startElement: TreeElement,
  type: T
) => {
  if (startElement.parent === null) return null;
  let currentElement: TreeElement | null = startElement.parent;

  if (currentElement.parent !== null)
    currentElement = addParents(currentElement, type);
  return currentElement;
};

const addParents = <T extends Reactiv.Component>(
  treeElement: TreeElement,
  type: T
): TreeElement | null => {
  let currentElement = treeElement.parent;
  let result = null;
  while (currentElement !== null) {
    if (currentElement.parent !== null) {
      result = addParents(currentElement, type);
      if (result !== null) return result;
    }

    if (currentElement.type === type) {
      result = currentElement;
      return result;
    }
    currentElement = currentElement.sibling;
  }

  return currentElement;
};
