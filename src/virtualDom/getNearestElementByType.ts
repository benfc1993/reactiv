import { TreeElement } from '../globals';
import { Reactiv } from '../types';

export const getNearestElementByType = <T extends Reactiv.Component>(
  startElement: TreeElement,
  type: T
) => {
  if (startElement.owner === null) return null;
  let currentElement: TreeElement | null = startElement.owner;

  if (currentElement.owner !== null)
    currentElement = addParents(currentElement, type);
  return currentElement;
};

const addParents = <T extends Reactiv.Component>(
  treeElement: TreeElement,
  type: T
): TreeElement | null => {
  let currentElement = treeElement.owner;
  let result = null;
  while (currentElement !== null) {
    if (currentElement.owner !== null) {
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
