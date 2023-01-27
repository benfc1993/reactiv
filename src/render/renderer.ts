import { componentElementIds, nodeGraph, resetPragma } from '../Jsx/pragma';
import { globals } from '../globals/globals';
import { Reactiv } from '../types';
import '../utils/array';

export const connections: Record<string, string[]> = {};
let rootNode: string = '';

export const createConnections = (
  nodeGraph: Record<number, [string, number][]>
) => {
  const nodeGraphArray = Object.values(nodeGraph);

  nodeGraphArray.forEach((layerEntries) => {
    layerEntries.forEach((entry) => {
      const [id] = entry;
      connections[id] = [];
    });
  });

  for (let i = nodeGraphArray.length - 1; i >= 0; i--) {
    const entries = nodeGraphArray[i];

    entries.forEach(([id, column]) => {
      if (column !== -1) {
        const parentId = nodeGraphArray[i - 1][column][0];
        connections[parentId].push(id);
        globals.componentElements[id].parentId = parentId;
      } else {
        rootNode = id.toString();
      }
    });
  }
};

export let renderIds: number[] = [];

export const rerender = (startId: string) => {
  globals.hasRendered = true;

  globals.renderOrder = createRenderOrder(startId);
  globals.resetCurrentStateIndex();
  globals.currentNodeIndex = 0;
  globals.parentId = startId;

  const startComponent = { ...globals.getCurrentComponentElement() };
  const startChildren = [...startComponent.fragmentChildren];

  if (startComponent.isFragment)
    globals.componentElements[startId].fragmentChildren = [];

  let parentElement: Node | HTMLElement | undefined = getParentElement(
    globals.componentElements[startId]
  );

  let element = globals.componentElements[startId].el;

  componentElementIds.push(startId);

  resetPragma(startId, startComponent.nodeTree.column);
  const newElement = globals.componentElements[startId].fn(
    globals.componentElements[startId].props
  );

  createConnections(nodeGraph);

  const parentComponent =
    globals.componentElements[globals.componentElements[startId].parentId];

  if (startComponent.isFragment && parentComponent.isFragment) {
    startChildren.forEach((child, idx) => {
      const childToReplaceIndex =
        parentComponent.fragmentChildren.indexOf(child);
      if (childToReplaceIndex !== -1) {
        parentComponent.fragmentChildren[childToReplaceIndex] =
          globals.componentElements[startId].fragmentChildren[idx];
      }
    });
  }

  if (startComponent.isFragment) {
    startChildren.forEach((child, idx) => {
      parentElement?.replaceChild(
        globals.componentElements[startId].fragmentChildren[idx],
        child
      );
    });
  } else {
    if (element) parentElement?.replaceChild(newElement, element);
    globals.componentElements[startId].el = newElement;
  }
  for (const id of globals.renderOrder) {
    if (id === startId) continue;
    delete globals.componentElements[id];
  }
};

const createRenderOrder = (start: string) => {
  const order: string[] = [start];
  addIdsToOrder(start, order);
  for (const id of order) {
    if (id === start) continue;
    delete connections[id];
    Object.entries(connections).forEach(([connectionId, connection]) => {
      const index = connection.indexOf(id.toString());
      connections[connectionId] = connection.removeAt(index);
    });
  }
  return order;
};

const addIdsToOrder = (
  id: string,

  order: string[]
) => {
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
