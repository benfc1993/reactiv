import { globals } from '../globals/globals';

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
  let parentElement: Node | HTMLElement | undefined =
    globals.componentElements[startFrom].parentEl;

  let element = globals.componentElements[startFrom].el;
  const res = globals.componentElements[startFrom].fn(
    globals.componentElements[startFrom].props
  );

  if (element) parentElement?.replaceChild(res, element);
  globals.componentElements[startFrom].el = res;
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
