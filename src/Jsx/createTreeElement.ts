import { TreeElement, TreeElementAction } from '../globals';

export const createTreeElement = (
  values: Partial<TreeElement>
): TreeElement => {
  const newTreeElement = {
    type: null,
    child: null,
    sibling: null,
    owner: null,
    element: null,
    DomElement: null,
    props: null,
    cache: [],
    action: TreeElementAction.ADD,
    ...values
  };

  return newTreeElement;
};
