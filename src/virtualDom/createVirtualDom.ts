import { TreeElement, TreeElementAction, globals } from '../globals';
import _ from 'lodash';

export const commitVirtualDom = (tree: TreeElement) => {
  console.log('TESTING');
  console.log({ ...tree });
  if (tree.child) {
    const vDom = createVirtualDom(tree.child);
    console.log(_.cloneDeep(tree));
    if (!vDom) return;
    tree.element?.appendChild(vDom);
    tree.child.DomElement = tree.child.element;
    tree.action = TreeElementAction.NONE;
    globals.tree = tree;
    console.log(globals.tree);
  }

  console.timeEnd('CreateVirtualDom');
};

const createVirtualDom = (workingTree: TreeElement): Node | null => {
  if (workingTree.child === null) return null;
  const root = workingTree.element;
  let currentElement = workingTree;

  if (currentElement.child !== null) addChildren(currentElement);

  workingTree.action = TreeElementAction.NONE;
  return root;
};

const addChildren = (treeElement: TreeElement) => {
  let currentElement = treeElement.child;
  while (currentElement !== null) {
    if (currentElement.child !== null) addChildren(currentElement);

    if (currentElement.element && treeElement.element) {
      handleTreeElementAction(
        treeElement.element as HTMLElement,
        currentElement
      );
    }
    if (currentElement.fragElements) {
      currentElement.fragDomElements = currentElement.fragElements;
    }

    currentElement.action = TreeElementAction.NONE;
    currentElement.DomElement = currentElement.element;
    if (currentElement.sibling === null) break;
    currentElement = currentElement.sibling;
  }
};

const handleTreeElementAction = (
  element: HTMLElement,
  treeElement: TreeElement
) => {
  if (treeElement.element === null) return;
  switch (treeElement.action) {
    case TreeElementAction.ADD:
      element.prepend(treeElement.element);
      break;
    case TreeElementAction.UPDATE:
      console.log('update');
      break;
  }
};
