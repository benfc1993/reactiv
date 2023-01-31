import { TreeElement, TreeElementAction } from '../globals';

export const createTreeElement = (
  values: Partial<TreeElement>
): TreeElement => {
  const newTreeElement: TreeElement = {
    type: null,
    child: null,
    sibling: null,
    parent: null,
    element: null,
    DomElement: null,
    props: null,
    cache: [],
    action: TreeElementAction.ADD,
    ...values
  };

  return newTreeElement;
};
