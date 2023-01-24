import { globals } from '../globals/globals';
import { Reactiv } from '../types';
import { CreateUUID } from '../utils/createUUID';
import { addChildren, handleProps } from './utils';

export const createElement = (
  fn: Reactiv.Component,
  props: object,
  el?: Node
): Reactiv.Element => {
  return {
    fn,
    props,
    el,
    cache: []
  };
};

let currentLayer = -1;
let currentColumn = 0;

export const nodeGraph: Record<number, [string, number][]> = {};
const layers: number[] = [];

let componentOrphans: Set<[Node, string]> = new Set();

function jsxPragma(
  type: string | Reactiv.Component,
  props: Record<string, any>,
  ...args: any[]
) {
  const children = args.flatMap((c) => c);

  //TODO: Reduce duplication here
  if (typeof type === 'function') {
    globals.resetCurrentStateIndex();

    if (!globals.hasRendered) {
      const prevLayer = currentLayer;
      currentLayer++;
      currentColumn = layers.reduce((count, l) => {
        if (l === prevLayer) count += 1;
        return count;
      }, -1);

      layers.push(currentLayer);
      const res = functionComponent(type, props, children);
      currentLayer = prevLayer;
      return res;
    } else {
      const res = functionComponent(type, props, children);
      return res;
    }
  }

  const element = document.createElement(type as string);

  const filteredChildren = children.filter(
    (child) => typeof child !== 'string' && child !== ''
  );

  if (filteredChildren.length > 0) {
    componentOrphans.forEach((orphan) => {
      const [el, id] = orphan;
      if (filteredChildren.includes(el)) {
        const temp = new Set(componentOrphans);
        globals.componentElements[id].parentEl = element;
        componentOrphans.delete(orphan);
      }
    });
  }

  handleProps(element, props);

  addChildren(element, children);

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
      const el = type({ ...props, children: children });

      componentOrphans.add([el, componentId]);

      globals.componentElements[componentId] = {
        ...globals.componentElements[componentId],
        props: propsWithChildren,
        el
      };

      return el;
    } else {
      const id = CreateUUID();
      globals.currentId = id;

      nodeGraph[currentLayer].push([id, currentColumn]);

      globals.componentElements[id] = createElement(type, propsWithChildren);
      const el = type(propsWithChildren);

      globals.componentElements[id].el = el;

      if (el) componentOrphans.add([el, id]);
      return el;
    }
  }
};

export default jsxPragma;
