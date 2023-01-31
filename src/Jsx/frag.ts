import '../utils/array.ts';
import { createTreeElement } from './createTreeElement';

function jsxFrag(props: { children: any[] }) {
  return {
    type: 'FRAGMENT',
    props: {
      ...props,
      children: props.children.flatMap((child) =>
        typeof child === 'object' ? child : createTreeElement(child)
      )
    }
  };
}

export default jsxFrag;
