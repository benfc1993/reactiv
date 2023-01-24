import {
  currentId,
  hasRendered,
  nodeOrder,
  incrementId,
  setGlobalParent
} from './renderer';
import { Reactiv } from './types';

export const createElement = (
  fn: Reactiv.Component,
  props: object,
  el?: Node
): Reactiv.Element => {
  return {
    fn,
    props,
    el
  };
};

let currentLayer = -1;
let currentColumn = 0;

export const nodeGraph: Record<number, [string, number][]> = {};
const layers: number[] = [];

// const nodeTree: Map<HTMLElement, HTMLElement[]> = new Map();
let componentOrphans: Set<[Node, string]> = new Set();

function jsxPragma(
  type: string | Reactiv.Component,
  props: Record<string, any>,
  ...args: any[]
) {
  const children = args.flatMap((c) => c);

  if (typeof type === 'function') {
    if (!hasRendered) {
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
        nodeOrder[id].parentEl = element;
        componentOrphans.delete(orphan);
      }
    });
  }

  if (props) {
    Object.entries(props).forEach(([key, value]) => {
      if (key.startsWith('on')) {
        const eventType = key.replace('on', '').toLowerCase();
        element.addEventListener(eventType, value);
      } else if (key === 'style') {
        element.setAttribute('style', parseStyles(value));
      } else if (key === 'className') {
        element.classList.value = value;
      } else {
        element.setAttribute(key, value);
      }
    });
  }

  children
    .flatMap((c) => c)
    .forEach((child) => {
      if (child === undefined) return;
      if (typeof child === 'string') {
        const childEl = document.createTextNode(child);
        element.appendChild(childEl);
      } else if (typeof child === 'function') {
      } else {
        element.appendChild(child);
      }
    });

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
  if (currentId !== undefined) {
    if (hasRendered) {
      incrementId();
      setGlobalParent(currentId);
      const componentId = currentId;
      const res = type({ ...props, children: children });
      componentOrphans.add([res, componentId]);
      nodeOrder[componentId].element.el = res;
      return res;
    } else {
      const id = Math.floor(Math.random() * 1000).toString();
      setGlobalParent(id.toString());

      nodeGraph[currentLayer].push([id, currentColumn]);
      const res = type(props);
      nodeOrder[id] = {
        id: id,
        element: createElement(type, { ...props, children: children }, res),
        parent: ''
      };
      if (res) componentOrphans.add([res, id]);
      return res;
    }
  }
};

const parseStyles = (styles: Record<string, string>) => {
  return Object.entries(styles)
    .map(([key, value]) => `${key}: ${value};`)
    .join(' ');
};

export default jsxPragma;
