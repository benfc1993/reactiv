import { Reactiv } from '../types';

export const createComponentElement = (
  parent: string,
  fn: Reactiv.Component,
  props: object,
  el?: Node
): Reactiv.Element => {
  return {
    parentId: parent,
    fn,
    props,
    el,
    isFragment: false,
    fragmentChildren: [],
    cache: []
  };
};
