import { TreeNode } from '../globals';
import { Reactiv } from '../types';

export const getNearestElementByType = <T extends Reactiv.Component<any>>(
  startElement: TreeNode,
  type: T
) => {
  if (startElement.parent === null) return null;
  let currentElement: TreeNode | null = startElement.parent;

  if (currentElement.parent !== null)
    currentElement = addParents(currentElement, type);
  return currentElement;
};

const addParents = <T extends Reactiv.Component>(
  treeElement: TreeNode,
  type: T
): TreeNode | null => {
  let currentElement = treeElement.parent;
  let result = null;
  while (currentElement !== null) {
    if (currentElement.type === type) {
      result = currentElement;
      return result;
    }

    if (currentElement.parent !== null) {
      result = addParents(currentElement, type);
      if (result !== null) return result;
    }

    currentElement = currentElement.sibling;
  }

  return currentElement;
};
