import { globals } from '../globals/globals';
import { componentElementIds } from './pragma';
import '../utils/array.ts';
import { Reactiv } from '../types';
import { addFragmentChildren } from './utils';

function jsxFrag(props: { children: any[] }) {
  try {
    const fragment = document.createDocumentFragment();
    const isComponent =
      componentElementIds.length > 0 && componentElementIds.last() !== 'el';

    let component: Reactiv.Element | null = null;

    if (isComponent) {
      component = globals.componentElements[componentElementIds.last()];
      component.fragmentChildren = [];
    }

    addFragmentChildren(
      fragment,
      component,
      props.children.flatMap((c) => c)
    );

    return fragment;
  } catch (error) {
    console.log(error);
  }
}

export default jsxFrag;
