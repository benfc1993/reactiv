import { Reactiv } from '../types';

export const createComponentElement = (
  id: string,
  nextHash: string,
  parentId: string,
  fn: Reactiv.Component,
  props: object,
  layer: number,
  column: number,
  el?: Node
): Reactiv.Element => {
  return {
    id,
    parentId,
    fn,
    props,
    el,
    nodeTree: {
      layer,
      column,
      nextHash
    },
    isFragment: false,
    fragmentChildren: [],
    cache: []
  };
};
