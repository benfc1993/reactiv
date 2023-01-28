import {
  TreeElement,
  componentFunctions,
  currentTreeElement
} from '../CreateDOM';
import { globals } from '../globals/globals';
import { Reactiv } from '../types';
import { CreateUUID } from '../utils/createUUID';
import { createComponentElement } from './createComponentElement';
import jsxFrag from './frag';
import { addChildren, handleProps } from './utils';

let currentLayer = -1;
let currentColumn = 0;
let layers: number[] = [];
let componentOrphans: Set<[Node, string]> = new Set();
export let nodeGraph: Record<number, [string, number][]> = {};
export let componentElementIds: (string | 'el')[] = [];

export const stack: TreeElement[] = [];
export const queue: TreeElement[] = [];

export const resetPragma = (startId: string, startColumn: number) => {
  currentLayer = 0;
  currentColumn = 0;
  layers = Array.from({ length: startColumn }).fill(0) as number[];
  componentOrphans = new Set();
  nodeGraph = { 0: [[startId, -1]] };
  componentElementIds = [startId];
};

function jsxPragma(
  type: string | Reactiv.Component,
  props: Record<string, any>,
  ...args: any[]
) {
  console.log(type);
  const children = args.flatMap((c) => c);
  console.log(args);
  if (typeof type === 'function') {
    if (type.name === 'jsxFrag') return type({ ...props, children });

    let element: Node | undefined;

    element = functionComponent(type, props, children);

    return element;
  }

  componentElementIds.push('el');

  const element = document.createElement(type as string);

  handleProps(element, props);

  const newTreeElement = stack.find((item) => item.element === element) || {
    type,
    child: null,
    sibling: null,
    owner: currentTreeElement,
    element,
    props
  };

  currentTreeElement.child = newTreeElement;
  // currentTreeElement = newTreeElement;
  stack.push(newTreeElement);

  addChildren(element, children);
  componentElementIds.pop();
  return element;
}

const functionComponent = (
  type: Reactiv.Component,
  props: Reactiv.BaseProps,
  children: any[]
) => {
  if (!(currentLayer in nodeGraph)) {
    nodeGraph[currentLayer] = [];
  }

  globals.incrementCurrentId();

  const propsWithChildren = { ...props, children: children };

  const column = layers.reduce((count, l) => {
    if (l === currentLayer) count += 1;
    return count;
  }, -1);

  const id = CreateUUID(type.name, globals?.currentId, column, currentLayer);

  const prevComponent = globals.currentId
    ? globals.componentElements[globals.currentId]
    : [];
  if (
    !globals.getCurrentComponentElement()?.nodeTree.nextHash ||
    id !== globals.getCurrentComponentElement()?.nodeTree.nextHash
  ) {
  }

  const nextHash = CreateUUID(type.name, id, column, currentLayer);
  if (globals?.currentId) delete globals.componentElements[globals?.currentId];

  globals.parentId = id;
  componentElementIds.push(id);

  // if (type.name === 'Provider') {
  //   let graphIndex: number = Infinity;
  //   const childIds: string[] = [];
  //   for (const child of children) {
  //     const childCompnentElement = Object.values(
  //       globals.componentElements
  //     ).find((el) => el.el === child);
  //     if (!childCompnentElement) continue;
  //     if (childCompnentElement?.nodeTree.column < graphIndex) {
  //       graphIndex = childCompnentElement?.nodeTree.column || Infinity;
  //     }
  //     childIds.push(childCompnentElement.id);
  //     childCompnentElement.parentId = id;
  //     const cacheIndex = childCompnentElement?.cache.indexOf(type);
  //     if (cacheIndex > -1) {
  //       childCompnentElement.cache[cacheIndex] = {
  //         contextElementId: id,
  //         nextId: nextHash,
  //         value: props.value
  //       };
  //       console.log(childCompnentElement);
  //     }
  //   }

  //   for (let i = Object.keys(nodeGraph).length - 1; i > currentLayer; i--) {
  //     nodeGraph[i + 1] = nodeGraph[i];
  //   }

  //   nodeGraph[currentLayer + 1] = [];

  //   for (const childId of childIds) {
  //     const graphItem = nodeGraph[currentLayer].find((el) => el[0] === childId);
  //     if (graphItem) {
  //       nodeGraph[currentLayer] = nodeGraph[currentLayer].remove(graphItem);
  //     }
  //   }

  //   console.log(currentLayer);
  //   console.log(nodeGraph[currentLayer].length);
  //   nodeGraph[currentLayer].push([id, nodeGraph[currentLayer - 1].length - 1]);
  //   for (const childId of childIds) {
  //     nodeGraph[currentLayer + 1].push([
  //       childId,
  //       nodeGraph[currentLayer].length - 1
  //     ]);
  //   }

  //   console.log(nodeGraph);
  // } else {
  //   nodeGraph[currentLayer].push([id, currentColumn]);
  // }

  const parentId = '';

  globals.componentElements[id] = {
    ...prevComponent,
    ...createComponentElement(
      id,
      nextHash,
      parentId,
      type,
      propsWithChildren,
      currentLayer,
      column
    )
  };

  const parentTreeElement = currentTreeElement;

  componentFunctions.push([type.name, () => type(propsWithChildren)]);
  // const el = type(propsWithChildren);

  console.log({ children });

  // globals.componentElements[id].el = el;

  // if (el) componentOrphans.add([el, id]);
  // const existingTreeElement = stack.find((item) => item.element === el);

  const newTreeElement = {
    // ...existingTreeElement,
    type,
    child: null,
    sibling: null,
    owner: parentTreeElement,
    element: null,
    props
  };
  stack.push(newTreeElement);
  queue.push(newTreeElement);
  parentTreeElement.child = newTreeElement;

  currentTreeElement.child = newTreeElement;

  // return el;
};

export default jsxPragma;
