import { globals } from '../globals/globals';
import { Reactiv } from '../types';
import { CreateUUID } from '../utils/createUUID';
import { createComponentElement } from './createComponentElement';
import { addChildren, handleProps } from './utils';

let currentLayer = -1;
let currentColumn = 0;

export const nodeGraph: Record<number, [string, number][]> = {};
const layers: number[] = [];

let componentOrphans: Set<[Node, string]> = new Set();
export const componentElementIds: (string | 'el')[] = [];

function jsxPragma(
  type: string | Reactiv.Component,
  props: Record<string, any>,
  ...args: any[]
) {
  const children = args.flatMap((c) => c);
  //TODO: Reduce duplication here
  if (typeof type === 'function') {
    if (type.name === 'jsxFrag') return type({ ...props, children });

    globals.resetCurrentStateIndex();
    const isFragComponent =
      componentElementIds.length > 0 &&
      componentElementIds.last() !== 'el' &&
      globals.componentElements[componentElementIds.last()]?.isFragment;

    let element: Node | undefined;

    if (!globals.hasRendered) {
      const prevLayer = currentLayer;
      currentLayer++;
      currentColumn = layers.reduce((count, l) => {
        if (l === prevLayer) count += 1;
        return count;
      }, -1);

      layers.push(currentLayer);
      element = functionComponent(type, props, children);
      currentLayer = prevLayer;
    } else {
      element = functionComponent(type, props, children);
    }
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
  if (globals.currentId !== undefined) {
    const propsWithChildren = { ...props, children: children };
    if (globals.hasRendered) {
      globals.incrementCurrentId();
      const componentId = globals.currentId;
      componentElementIds.push(componentId);
      const el = type(propsWithChildren);

      componentOrphans.add([el, componentId]);

      globals.componentElements[componentId] = {
        ...globals.componentElements[componentId],
        props: propsWithChildren,
        el
      };

      return el;
    } else {
      const id = CreateUUID();
      const parentId = globals.currentId;
      globals.currentId = id;
      componentElementIds.push(id);
      nodeGraph[currentLayer].push([id, currentColumn]);

      globals.componentElements[id] = createComponentElement(
        parentId,
        type,
        propsWithChildren
      );
      const el = type(propsWithChildren);

      globals.componentElements[id].el = el;

      if (el) componentOrphans.add([el, id]);
      return el;
    }
  }
};

export default jsxPragma;
