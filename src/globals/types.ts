import { Reactiv } from '../types';

export type TreeNode = {
  type: any;
  child: TreeNode | null;
  sibling: TreeNode | null;
  parent: TreeNode | null;
  element: Node | null;
  domElement: Node | null;
  props: any | null;
  cache: any[];
  fragElements?: Node[];
  fragDomElements?: Node[];
  action: TreeNodeAction;
};

export enum TreeNodeAction {
  NONE = 'NONE',
  ADD = 'ADD',
  UPDATE = 'UPDATE'
}

export interface Globals {
  get tree(): TreeNode;
  set tree(value: TreeNode);
  nodeTree: TreeNode;
  currentTreeNode: TreeNode;
  cacheIndex: number;
  resetCacheIndex(): void;
  incrementCurrentStateIndex(): void;
}
