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
      if (typeof child === 'string' || typeof child === 'number') {
        const childEl = document.createTextNode(child.toString());
        element.appendChild(childEl);
      } else if (typeof child === 'function') {
      } else {
        element.appendChild(child);
      }
    });
};

export const parseStyles = (styles: Record<string, string>) => {
  return Object.entries(styles)
    .map(([key, value]) => `${key}: ${value};`)
    .join(' ');
};
