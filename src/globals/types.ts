import { Reactiv } from '../types';

export type TreeElement = {
  type: any;
  child: TreeElement | null;
  sibling: TreeElement | null;
  owner: TreeElement | null;
  element: Node | null;
  props: any | null;
};

export interface Globals {
  tree: TreeElement;
}
