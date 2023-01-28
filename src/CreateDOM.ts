import { nodeGraph, queue, stack } from './Jsx/pragma';
import {
  createConnections,
  rerender,
  rootComponentElementId
} from './render/renderer';
import { Reactiv } from './types';

export let rootNode!: HTMLElement;

export const componentFunctions: [string, () => Node][] = [];

export type TreeElement = {
  type: any;
  child: TreeElement | null;
  sibling: TreeElement | null;
  owner: TreeElement | null;
  element: Node | null;
  props: any | null;
};
export const tree: TreeElement = {
  type: 'root',
  child: null,
  sibling: null,
  owner: null,
  element: document.getElementById('root'),
  props: null
};

export let currentTreeElement: TreeElement = tree;
export const CreateDOM = (rootId: string, rootFn: Reactiv.Component) => {
  const tryGetRootNode = document.getElementById(rootId);
  if (tryGetRootNode) {
    rootNode = tryGetRootNode;
    // componentFunctions.push(['root', () => rootFn({})]);
    // while (componentFunctions.length > 0) {
    //   console.log(componentFunctions);
    //   const fn = componentFunctions.pop()!;
    //   console.log(fn[0]);
    //   fn[1]();
    // }
    // createConnections(nodeGraph);
    // rerender(rootComponentElementId);
    rootFn({});
    console.log(...stack);
    console.log(tree);
    while (queue.length > 0) {
      currentTreeElement = queue.pop();
      currentTreeElement.type(currentTreeElement.props);
    }
    console.log(tree);

    // rootNode.appendChild(newDom);
  } else {
    throw new Error(`No Root node found with id: ${rootId}`);
  }
};
