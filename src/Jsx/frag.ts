import '../utils/array.ts';
import { createTreeNode } from './createTreeNode';

function jsxFrag(props: { children: any[] }) {
  return {
    type: 'FRAGMENT',
    props: {
      ...props,
      children: props.children.flatMap((child) =>
        typeof child === 'object' ? child : createTreeNode(child)
      )
    }
  };
}

export default jsxFrag;
