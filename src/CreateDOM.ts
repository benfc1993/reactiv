import { nodeGraph } from './Jsx/jsx';
import { createConnections } from './render/renderer';
import { Reactiv } from './types';

export let rootNode!: HTMLElement;

export const CreateDOM = (rootId: string, rootFn: Reactiv.Component) => {
  const tryGetRootNode = document.getElementById(rootId);
  if (tryGetRootNode) {
    rootNode = tryGetRootNode;
    tryGetRootNode?.appendChild(rootFn({}));
    createConnections(nodeGraph);
  } else {
    throw new Error(`No Root node found with id: ${rootId}`);
  }
};
