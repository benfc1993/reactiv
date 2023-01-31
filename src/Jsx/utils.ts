import { TreeElement } from '../globals';
import { stack } from '../virtualDom/createTree';
import { isWritable } from '../utils/isWritable';

export const handleProps = (
  element: HTMLElement,
  props: Record<string, any>
) => {
  if (props) {
    Object.entries(props).forEach(([key, value]) => {
      if (key.startsWith('on')) {
        const eventType = key.replace('on', '').toLowerCase();
        element.addEventListener(eventType, value);
      } else if (key === 'style') {
        element.setAttribute('style', parseStyles(value));
      } else if (key === 'className') {
        element.classList.value = value;
      } else if (key === 'ref') {
        value.current = element;
      } else if (key !== 'children') {
        (element as any)[key] = value;
      }
    });
  }
};

export const parseStyles = (styles: Record<string, string>) => {
  return Object.entries(styles)
    .map(([key, value]) => `${key}: ${value};`)
    .join(' ');
};
