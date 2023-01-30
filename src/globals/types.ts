import { Reactiv } from '../types';

export type TreeElement = {
  type: any;
  child: TreeElement | null;
  sibling: TreeElement | null;
  owner: TreeElement | null;
  element: Node | null;
  DomElement: Node | null;
  props: any | null;
  cache: any[];
  fragElements?: Node[];
  fragDomElements?: Node[];
  action: TreeElementAction;
};

export enum TreeElementAction {
  NONE = 'NONE',
  ADD = 'ADD',
  UPDATE = 'UPDATE'
}

export interface Globals {
  get tree(): TreeElement;
  set tree(value: TreeElement);
  nodeTree: TreeElement;
  currentTreeElement: TreeElement;
  cacheIndex: number;
  resetCacheIndex(): void;
  incrementCurrentStateIndex(): void;
}
