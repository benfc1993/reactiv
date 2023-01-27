import { globals } from '../globals/globals';
import { Reactiv } from '../types';
import { CreateUUID } from '../utils/createUUID';
import { createComponentElement } from './createComponentElement';
import { addChildren, handleProps } from './utils';

let currentLayer = -1;
let currentColumn = 0;
let layers: number[] = [];
let componentOrphans: Set<[Node, string]> = new Set();
export let nodeGraph: Record<number, [string, number][]> = {};
export let componentElementIds: (string | 'el')[] = [];

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
  const children = args.flatMap((c) => c);

  if (typeof type === 'function') {
    if (type.name === 'jsxFrag') return type({ ...props, children });

    globals.resetCurrentStateIndex();
    const isFragComponent =
      componentElementIds.length > 0 &&
      componentElementIds.last() !== 'el' &&
      globals.componentElements[componentElementIds.last()]?.isFragment;

    let element: Node | undefined;

    const prevLayer = currentLayer;
    currentLayer++;
    currentColumn = layers.reduce((count, l) => {
      if (l === prevLayer) count += 1;
      return count;
    }, -1);

    layers.push(currentLayer);
    element = functionComponent(type, props, children);
    currentLayer = prevLayer;

    componentElementIds.pop();
    if (isFragComponent && element)
      globals.componentElements[
        componentElementIds.last()
      ].fragmentChildren.push(element);
    return element;
  }
  componentElementIds.push('el');

  const element = document.createElement(type as string);

  const filteredChildren = children.filter(
    (child) =>
      typeof child !== 'string' && typeof child !== 'number' && child !== ''
  );

  if (filteredChildren.length > 0) {
    componentOrphans.forEach((orphan) => {
      const [el, id] = orphan;
      if (filteredChildren.includes(el)) {
        const temp = new Set(componentOrphans);
        globals.componentElements[id].parentElement = element;
        componentOrphans.delete(orphan);
      }
    });
  }

  handleProps(element, props);

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
  nodeGraph[currentLayer].push([id, currentColumn]);

  globals.componentElements[id] = {
    ...createComponentElement(
      nextHash,
      type,
      propsWithChildren,
      currentLayer,
      column
    ),
    ...prevComponent
  };
  const el = type(propsWithChildren);

  globals.componentElements[id].el = el;

  if (el) componentOrphans.add([el, id]);

  return el;
};

export default jsxPragma;
