import { TreeElement, TreeElementAction, globals } from '../globals';
import _ from 'lodash';

export const commitVirtualDom = (tree: TreeElement | null) => {
  if (!tree) return;

  let parentElement: TreeElement | null = tree.parent;

  while (!parentElement?.DomElement) {
    parentElement = parentElement?.parent ?? null;
  }

  const parentDomElement = parentElement?.DomElement;

  if (tree.action === TreeElementAction.ADD && tree.DomElement) {
    parentDomElement.appendChild(tree.DomElement);
  }

  commitVirtualDom(tree.child);
  commitVirtualDom(tree.sibling);
};
