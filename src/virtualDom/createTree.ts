import { createTreeElement } from '../Jsx/createTreeElement';
import { handleProps } from '../Jsx/utils';
import { TreeElement, globals } from '../globals';
import { Reactiv } from '../types';
import { Element } from '../Jsx/pragma';
import { commitVirtualDom } from './createVirtualDom';

export const stack: TreeElement[] = [];
export const queue: TreeElement[] = [];

export let currentElement: TreeElement | null;
let rootElement: TreeElement | null = null;
export const createTree = (root: HTMLElement, rootFn: Node) => {
  rootElement = createTreeElement({
    DomElement: root,
    props: { children: [rootFn] }
  });
  currentElement = rootElement;

  requestIdleCallback((deadline: IdleDeadline) => processTree(deadline));
};

export const processTree = (deadline: IdleDeadline) => {
  let shouldYield = false;

  while (currentElement && !shouldYield) {
    currentElement = processNextElement(currentElement);

    shouldYield = deadline.timeRemaining() < 1;
  }
  if (!currentElement && rootElement) {
    console.log(rootElement);
    commitVirtualDom(rootElement?.child);
  } else {
    requestIdleCallback((deadline: IdleDeadline) => processTree(deadline));
  }
};

requestIdleCallback(processTree);

const processNextElement = (currentElement: TreeElement) => {
  if (typeof currentElement.type === 'function') {
    globals.resetCacheIndex();
    const children = [currentElement.type(currentElement.props)];

    handleChildren(currentElement, children);
  } else {
    currentElement.DomElement = createDom(currentElement);

    handleChildren(currentElement, currentElement.props?.children);
  }
  if (currentElement.child !== null) return currentElement.child;

  let nextElement: TreeElement | null = currentElement;
  while (nextElement) {
    if (nextElement.sibling) return nextElement.sibling;
    nextElement = nextElement.parent;
  }
  return null;
};
function createDom(currentElement: TreeElement): Node | null {
  if (!currentElement.type) return currentElement.DomElement;
  let domElement;

  switch (currentElement.type) {
    case 'TEXT_ELEMENT':
      domElement = document.createTextNode('');
      break;
    case 'FRAGMENT':
      const frag = document.createDocumentFragment();
      currentElement.props.children.forEach((child: any) => {
        if (typeof child.type !== 'function' && typeof child !== 'object')
          frag.appendChild(child);
      });
      break;
    default:
      domElement = document.createElement(currentElement.type);
      break;
  }

  handleProps(domElement, currentElement.props);
  return domElement;
}
function handleChildren(currentElement: TreeElement, children: Element[]) {
  if (!children) return;
  let prevSibling: TreeElement | null = null;

  for (let i = 0; i < children.length; i++) {
    const child = children[i];

    const newElement: TreeElement = createTreeElement({
      type: child.type,
      props: child.props,
      parent: currentElement
    });
    if (i == 0) currentElement.child = newElement;
    else if (prevSibling) prevSibling.sibling = newElement;

    i++;
    prevSibling = newElement;
  }
}
