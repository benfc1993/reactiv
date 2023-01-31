import { TreeNode, TreeNodeAction, globals } from '../globals';
import { debug } from '../debugConfig';

export const commitVirtualDom = (tree: TreeNode | null) => {
  if (!tree) return;
  commitElement(tree);
  if (debug.benchmark) console.timeEnd('commit virtual DOM');
};
const commitElement = (tree: TreeNode | null) => {
  if (!tree) return;

  let parentElement: TreeNode | null = tree.parent;

  while (!parentElement?.domElement) {
    parentElement = parentElement?.parent ?? null;
  }

  const parentDomElement = parentElement?.domElement;

  if (tree.action === TreeNodeAction.ADD && tree.domElement) {
    parentDomElement.appendChild(tree.domElement);
  }

  commitElement(tree.child);
  commitElement(tree.sibling);
};
