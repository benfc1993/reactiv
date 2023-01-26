import { componentElementIds } from '../Jsx/pragma';
import { globals } from '../globals/globals';
import { Reactiv } from '../types';

export const connections: Record<string, string[]> = {};
let rootNode: string = '';

export const createConnections = (
  nodeGraph: Record<number, [string, number][]>
) => {
  const nodeGraphArray = Object.values(nodeGraph);

  nodeGraphArray.forEach((layerEntries) => {
    layerEntries.forEach((entry) => {
      const [id, column] = entry;
      connections[id] = [];
    });
  });

  for (let i = nodeGraphArray.length - 1; i >= 0; i--) {
    const entries = nodeGraphArray[i];

    entries.forEach(([id, column]) => {
      if (column !== -1) {
        const parentId = nodeGraphArray[i - 1][column][0];
        connections[parentId].push(id.toString());
      } else {
        rootNode = id.toString();
      }
    });
  }
};

export let renderIds: number[] = [];

export const rerender = (startFrom: string) => {
  globals.hasRendered = true;

  globals.renderOrder = createRenderOrder(startFrom);

  globals.resetCurrentStateIndex();
  globals.currentNodeIndex = 0;
  globals.currentId = startFrom;
  componentElementIds.splice(0);

  const startComponent = { ...globals.getCurrentComponentElement() };
  const startChildren = [...startComponent.fragmentChildren];
  if (startComponent.isFragment)
    globals.componentElements[startFrom].fragmentChildren = [];

  let parentElement: Node | HTMLElement | undefined = getParentElement(
    globals.componentElements[startFrom]
  );

  let element = globals.componentElements[startFrom].el;

  componentElementIds.push(startFrom);

  const newElement = globals.componentElements[startFrom].fn(
    globals.componentElements[startFrom].props
  );

  const parentComponent =
    globals.componentElements[globals.componentElements[startFrom].parentId];

  if (startComponent.isFragment && parentComponent.isFragment) {
    startChildren.forEach((child, idx) => {
      const childToReplaceIndex =
        parentComponent.fragmentChildren.indexOf(child);
      if (childToReplaceIndex !== -1) {
        parentComponent.fragmentChildren[childToReplaceIndex] =
          globals.componentElements[startFrom].fragmentChildren[idx];
      }
    });
  }

  if (startComponent.isFragment) {
    startChildren.forEach((child, idx) => {
      parentElement?.replaceChild(
        globals.componentElements[startFrom].fragmentChildren[idx],
        child
      );
    });
  } else {
    if (element) parentElement?.replaceChild(newElement, element);
    globals.componentElements[startFrom].el = newElement;
  }
};

const createRenderOrder = (start: string) => {
  const order: string[] = [start];
  addIdsToOrder(start, order);
  return order;
};

const addIdsToOrder = (id: string, order: string[]) => {
  const ids = connections[id];
  if (ids.length > 0) {
    ids.forEach((id) => {
      order.push(id);
      return addIdsToOrder(id, order);
    });
  } else {
    return;
  }
};

const getParentElement = (component: Reactiv.Element) => {
  if (component.isFragment) {
    let parentElement = globals.componentElements[component.parentId];
    while (parentElement.isFragment && parentElement !== undefined) {
      parentElement = globals.componentElements[parentElement.parentId];
    }
    if (!parentElement) return undefined;
    return parentElement.el;
  } else {
    return component.parentElement;
  }
};
