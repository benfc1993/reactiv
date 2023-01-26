import { Reactiv } from '../types';

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
      } else {
        element.setAttribute(key, value);
      }
    });
  }
};

export const addChildren = (element: Node, children: any[]) => {
  children
    .flatMap((c) => c)
    .forEach((child) => {
      if (child === undefined) return;
      if (typeof child === 'boolean' && !child) {
        const childEl = document.createTextNode('');
        element.appendChild(childEl);
      } else if (typeof child === 'string' || typeof child === 'number') {
        const childEl = document.createTextNode(child.toString());
        element.appendChild(childEl);
      } else if (typeof child === 'function') {
      } else {
        element.appendChild(child);
      }
    });
};

export const addFragmentChildren = (
  element: Node,
  component: Reactiv.Element | null,
  children: any[]
) => {
  children
    .flatMap((c) => c)
    .forEach((child) => {
      if (child === undefined) return;
      if (typeof child === 'boolean' && !child) {
        const childEl = document.createTextNode('');
        component?.fragmentChildren.push(childEl);
        element.appendChild(childEl);
      } else if (typeof child === 'string' || typeof child === 'number') {
        const childEl = document.createTextNode(child.toString());
        component?.fragmentChildren.push(childEl);
        element.appendChild(childEl);
      } else if (typeof child === 'function') {
      } else if (child instanceof Node) {
        const beforeChildren = new Set(element.childNodes);
        element.appendChild(child);
        if (child.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
          const afterChildren = new Set(element.childNodes);
          beforeChildren.forEach((prevChild) => {
            afterChildren.delete(prevChild);
          });
          component?.fragmentChildren.push(...Array.from(afterChildren));
        } else {
          component?.fragmentChildren.push(child);
        }
      }
    });
};

export const parseStyles = (styles: Record<string, string>) => {
  return Object.entries(styles)
    .map(([key, value]) => `${key}: ${value};`)
    .join(' ');
};
