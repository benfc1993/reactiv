import { Globals, TreeElement, TreeElementAction } from './types';
import _ from 'lodash';

const blankTree: TreeElement = {
  type: 'root',
  child: null,
  sibling: null,
  owner: null,
  element: null,
  DomElement: null,
  props: null,
  cache: [],
  action: TreeElementAction.NONE
};

export const globals: Globals = {
  nodeTree: blankTree,
  get tree() {
    return this.nodeTree;
  },
  set tree(value) {
    this.nodeTree = value;
  },
  currentTreeElement: blankTree,
  cacheIndex: 0,
  resetCacheIndex() {
    this.cacheIndex = 0;
  },
  incrementCurrentStateIndex() {
    this.cacheIndex++;
  }
};
