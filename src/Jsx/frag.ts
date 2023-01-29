import { TreeElement } from '../globals';
import '../utils/array.ts';
import { addChildren, addTreeChildren } from './utils';
import { currentTreeElement, stack } from '../CreateDOM';

function jsxFrag(props: { children: any[] }) {
  try {
    const element = document.createDocumentFragment();

    const treeElement: TreeElement = {
      type: null,
      child: null,
      sibling: null,
      owner: currentTreeElement,
      element,
      props
    };

    addChildren(element, props.children);
    addTreeChildren(props.children, treeElement);

    stack.unshift(treeElement);

    return element;
  } catch (error) {
    console.log(error);
  }
}

export default jsxFrag;
