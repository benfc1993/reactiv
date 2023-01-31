import { TreeElement, globals } from '../globals';

const createTextElement = (text: string): Element => {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
      children: []
    }
  };
};

export type Element = Partial<TreeElement>;

function jsxPragma(
  type: string,
  props: Record<string, any>,
  ...children: any[]
): Element {
  const response = {
    type,
    props: {
      ...props,
      children: children.flatMap((child) =>
        typeof child === 'object' ? child : createTextElement(child)
      )
    }
  };

  return response;
}

export default jsxPragma;
