import { TreeElement } from '../globals';
import '../utils/array.ts';
import { addChildren, addTreeChildren } from './utils';
import { createTreeElement } from './createTreeElement';
import { currentTreeElement, stack } from '../virtualDom/createTree';

function jsxFrag(props: { children: any[] }) {
  try {
    const element = document.createDocumentFragment();

    const treeElement: TreeElement = createTreeElement({
      owner: currentTreeElement,
      element,
      props,
      fragElements: [...props.children]
    });

    addChildren(element, props.children);
    addTreeChildren(props.children, treeElement);

    stack.unshift(treeElement);

    return element;
  } catch (error) {
    console.log(error);
  }
}

export default jsxFrag;
