import { globals } from './globals';
import { TreeElement } from './globals/types';

import { Reactiv } from './types';
import { benchmark } from './utils/benchmark';
import { loudLog } from './utils/loudLog';

export let rootNode!: HTMLElement;

export const componentFunctions: [string, () => Node][] = [];

const workingTree: TreeElement = {
  child: null,
  element: null,
  owner: null,
  props: null,
  sibling: null,
  type: null
};

export const stack: TreeElement[] = [];
export const queue: TreeElement[] = [];

export let currentTreeElement: TreeElement = workingTree;
export let currentComponentElement: TreeElement = workingTree;
export const setCurrentTreeElement = (newElement: TreeElement) => {
  currentTreeElement = newElement;
};
export const componentFunctionChildren: TreeElement[] = [];
export const CreateDOM = (rootId: string, rootFn: Reactiv.Component) => {
  console.time('CreateVirtualDom');

  const tryGetRootNode = document.getElementById(rootId);
  if (tryGetRootNode) {
    workingTree.element = tryGetRootNode;

    rootFn({});
    requestIdleCallback(processVDOM);
  } else {
    throw new Error(`No Root node found with id: ${rootId}`);
  }
};

const processVDOM = (deadline: IdleDeadline) => {
  let shouldYield = false;

  while (queue.length > 0 && !shouldYield) {
    processNextElement();
    shouldYield = deadline.timeRemaining() < 1;
  }
  if (queue.length === 0) {
    commitVirtualDom(workingTree);
  } else {
    requestIdleCallback(processVDOM);
  }
};

const commitVirtualDom = (tree: TreeElement) => {
  const vDom = createVirtualDom();

  if (vDom) workingTree.element?.appendChild(vDom);

  globals.tree = workingTree;
  loudLog('Base tree', tree);
  console.timeEnd('CreateVirtualDom');
};

const processNextElement = () => {
  const topElement = queue.shift();
  if (!topElement) return;
  currentComponentElement = topElement;
  currentTreeElement = topElement;

  const element = currentComponentElement.type(currentTreeElement.props);
  const inStack = stack.find((item) => item.element === element);
  if (inStack) {
    stack.shift();
    inStack.type = topElement.type;
    inStack.props = topElement.props;
    inStack.element = element;
    Object.assign(topElement, inStack);
  }
};

const createVirtualDom = (): Node | null => {
  if (workingTree.child === null) return null;
  const root = workingTree.child.element;
  let currentElement = workingTree.child;

  if (currentElement.child !== null) addChildren(currentElement);
  return root;
};

const addChildren = (treeElement: TreeElement) => {
  let currentElement = treeElement.child;
  while (currentElement !== null) {
    if (currentElement.child !== null) addChildren(currentElement);

    if (currentElement.element)
      (treeElement.element as HTMLElement)?.prepend(currentElement.element);
    if (currentElement.sibling === null) break;
    currentElement = currentElement.sibling;
  }
};
