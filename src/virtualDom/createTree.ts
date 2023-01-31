import { createTreeNode } from '../Jsx/createTreeNode';
import { handleProps } from '../Jsx/utils';
import { TreeNode, globals } from '../globals';
import { commitVirtualDom } from './createVirtualDom';
import { debug } from '../debugConfig';
import { loudLog } from '../utils/loudLog';

export const stack: TreeNode[] = [];
export const queue: TreeNode[] = [];

export let currentNode: TreeNode | null;
let rootNode: TreeNode | null = null;
export const createTree = (root: HTMLElement, rootFn: Node) => {
  rootNode = createTreeNode({
    domElement: root,
    props: { children: [rootFn] }
  });
  currentNode = rootNode;
  if (debug.benchmark) console.time('processTree');

  requestIdleCallback((deadline: IdleDeadline) => processTree(deadline));
};

export const processTree = (deadline: IdleDeadline) => {
  let shouldYield = false;

  while (currentNode && !shouldYield) {
    currentNode = processNextNode(currentNode);

    shouldYield = deadline.timeRemaining() < 1;
  }
  if (!currentNode && rootNode) {
    if (debug.enableDebug) loudLog('tree', rootNode);
    if (debug.benchmark) {
      console.timeEnd('processTree');
      console.time('commit virtual DOM');
    }
    commitVirtualDom(rootNode?.child);
  } else {
    requestIdleCallback((deadline: IdleDeadline) => processTree(deadline));
  }
};

const processNextNode = (currentNode: TreeNode) => {
  globals.currentTreeNode = currentNode;
  if (typeof currentNode.type === 'function') {
    handleFunctionComponentNode(currentNode);
  } else {
    currentNode.domElement = createDom(currentNode);

    handleChildren(currentNode, currentNode.props?.children);
  }
  if (currentNode.child !== null) return currentNode.child;

  let nextNode: TreeNode | null = currentNode;
  while (nextNode) {
    if (nextNode.sibling) return nextNode.sibling;
    nextNode = nextNode.parent;
  }
  return null;
};

const handleFunctionComponentNode = (functionNode: TreeNode) => {
  const { type, props } = functionNode;
  globals.resetCacheIndex();
  const children = [type(props)];

  handleChildren(functionNode, children);
};

function createDom(currentNode: TreeNode): Node | null {
  if (!currentNode.type) return currentNode.domElement;
  let DomElement;

  switch (currentNode.type) {
    case 'TEXT_ELEMENT':
      DomElement = document.createTextNode('');
      break;
    case 'FRAGMENT':
      const frag = document.createDocumentFragment();
      currentNode.props.children.forEach((child: any) => {
        if (typeof child.type !== 'function' && typeof child !== 'object')
          frag.appendChild(child);
      });
      break;
    default:
      DomElement = document.createElement(currentNode.type);
      break;
  }

  handleProps(DomElement, currentNode.props);
  return DomElement;
}
function handleChildren(currentNode: TreeNode, children: TreeNode[]) {
  if (!children) return;
  let prevSibling: TreeNode | null = null;

  for (let i = 0; i < children.length; i++) {
    const child = children[i];

    const newNode: TreeNode = createTreeNode({
      type: child.type,
      props: child.props,
      parent: currentNode
    });
    if (i == 0) currentNode.child = newNode;
    else if (prevSibling) prevSibling.sibling = newNode;

    prevSibling = newNode;
  }
}
