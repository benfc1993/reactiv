import {
  currentTreeElement,
  currentComponentElement,
  stack,
  queue
} from '../CreateDOM';
import { TreeElement } from '../globals';
import { Reactiv } from '../types';
import { addChildren, addTreeChildren, handleProps } from './utils';

function jsxPragma(
  type: string | Reactiv.Component,
  props: Record<string, any>,
  ...args: any[]
) {
  const children = args.flatMap((c) => c);
  if (typeof type === 'function') {
    if (type.name === 'jsxFrag') return type({ ...props, children });

    functionComponent(type, props, children);

    return;
  }

  const element = document.createElement(type as string);
  handleProps(element, props);

  const treeElement: TreeElement = {
    type,
    child: null,
    sibling: null,
    owner: currentTreeElement,
    element,
    props
  };

  addChildren(element, children);
  addTreeChildren(children, treeElement);

  stack.unshift(treeElement);

  return element;
}

const functionComponent = (
  type: Reactiv.Component,
  props: Reactiv.BaseProps,
  children: any[]
) => {
  const newTreeElement: TreeElement = {
    type,
    child: null,
    sibling: null,
    owner: currentComponentElement,
    element: null,
    props: { ...props, children }
  };

  currentComponentElement.child = newTreeElement;
  const functionChildren = children.filter(
    (child) => child === undefined
  ).length;

  for (let i = queue.length - 1; i >= queue.length - functionChildren; i--) {
    queue[i].owner = newTreeElement;
    if (i < queue.length - 1) {
      queue[i + 1].sibling = queue[i];
    }

    if (i == queue.length - 1) {
      newTreeElement.child = queue[i];
    }
  }

  queue.unshift(newTreeElement);
  stack.unshift(newTreeElement);
};

export default jsxPragma;
