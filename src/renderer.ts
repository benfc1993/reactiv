import { Reactiv } from './types';

export let hasRendered = false;
export let currentId: string = '';
export const setCurrentId = (id: string) => (currentId = id);
export const incrementId = () => {
  currentNodeIndex += 1;
  currentId = renderOrder[currentNodeIndex];
};

export let currentStateIndex = 0;
export const incrementCurrentStateIndex = () => (currentStateIndex += 1);
export const resetCurrentStateIndex = () => (currentStateIndex = 0);

export const componentElements: {
  [id: string]: Reactiv.Element;
} = {};

export let renderOrder: string[] = [];
export let currentNodeIndex = 0;

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
  hasRendered = true;

  renderOrder = createRenderOrder(startFrom);

  resetCurrentStateIndex();
  currentNodeIndex = 0;
  currentId = startFrom;
  let parentElement: Node | HTMLElement | undefined =
    componentElements[startFrom].parentEl;

  let element = componentElements[startFrom].el;
  const res = componentElements[startFrom].fn(
    componentElements[startFrom].props
  );

  if (element) parentElement?.replaceChild(res, element);
  componentElements[startFrom].el = res;
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
