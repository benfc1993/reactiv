import { Reactiv } from "./types";

export let hasRendered = false;
export let currentId: string | undefined = "";

export const nodeOrder: {
  [id: string]: {
    id: string;
    element: Reactiv.Element;
    parent: string;
    parentEl?: Node;
  };
} = {};

export let renderOrder: string[] = [];
export let currentNodeIndex = 0;
export const incrementId = () => {
  currentNodeIndex += 1;
  currentId = renderOrder[currentNodeIndex];
};

export const connections: Record<string, string[]> = {};
let rootNode: string = "";
export let globalParent: string = "";
export const setGlobalParent = (value: string) => {
  globalParent = value;
};

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
        connections[parentId].unshift(id.toString());
        nodeOrder[id].parent = parentId.toString();
      } else {
        rootNode = id.toString();
      }
    });
  }
};

export let renderIds: number[] = [];

export const rerender = (startFrom: string) => {
  console.log("test");
  console.log(nodeOrder[startFrom].parentEl);
  hasRendered = true;

  renderOrder = createRenderOrder(startFrom);

  currentNodeIndex = 0;
  currentId = startFrom;
  globalParent = startFrom;
  let parentElement: Node | HTMLElement | undefined =
    nodeOrder[startFrom].parentEl;

  let element = nodeOrder[startFrom].element.el;
  const res = nodeOrder[startFrom].element.fn(
    nodeOrder[startFrom].element.props
  );

  if (element) parentElement?.replaceChild(res, element);
  nodeOrder[startFrom].element.el = res;
};

const createRenderOrder = (start: string) => {
  const order: string[] = [start];
  addIdsToOrder(start, order);
  return order;
};

const addIdsToOrder = (id: string, order: string[]) => {
  const ids = connections[id];
  if (ids.length > 0) {
    ids.reverse().forEach((id) => {
      order.push(id);
      return addIdsToOrder(id, order);
    });
  } else {
    return;
  }
};
