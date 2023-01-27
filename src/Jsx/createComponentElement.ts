import { Reactiv } from '../types';

export const createComponentElement = (
  nextHash: string,
  fn: Reactiv.Component,
  props: object,
  layer: number,
  column: number,
  el?: Node
): Reactiv.Element => {
  return {
    parentId: '',
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
