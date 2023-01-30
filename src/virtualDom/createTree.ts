import { createTreeElement } from '../Jsx/createTreeElement';
import { TreeElement, globals } from '../globals';
import { Reactiv } from '../types';
import { CreateUUID } from '../utils/createUUID';
import { commitVirtualDom } from './createVirtualDom';

export const stack: TreeElement[] = [];
export const queue: TreeElement[] = [];

export let currentTreeElement: TreeElement;
export let currentComponentElement: TreeElement;

export const createTree = (root: HTMLElement, rootFn: Reactiv.Component) => {
  globals.tree = createTreeElement({ element: root, DomElement: root });

  currentTreeElement = globals.tree;
  currentComponentElement = globals.tree;

  rootFn({});
  requestIdleCallback((deadline: IdleDeadline) =>
    processTree(deadline, globals.tree)
  );
};

export const processTree = (deadline: IdleDeadline, tree: TreeElement) => {
  let shouldYield = false;

  while (queue.length > 0 && !shouldYield) {
    processNextElement();
    shouldYield = deadline.timeRemaining() < 1;
  }
  if (queue.length === 0) {
    commitVirtualDom(tree);
  } else {
    requestIdleCallback((deadline: IdleDeadline) =>
      processTree(deadline, tree)
    );
  }
};

const processNextElement = () => {
  console.log(queue);
  const topElement = queue.shift();
  if (!topElement) return;
  globals.currentTreeElement = topElement;
  currentComponentElement = topElement;
  currentTreeElement = topElement;
  console.log(globals.currentTreeElement.type.name);
  currentComponentElement.type(currentTreeElement.props);

  const inStack = stack.shift();
  topElement.element = inStack.element;
  topElement.child = inStack.child;
  topElement.fragElements = inStack.fragElements;

  console.log('top Cache: ', topElement.cache);

  globals.resetCacheIndex();
};
