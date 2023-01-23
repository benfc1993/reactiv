export namespace Reactiv {
  export type BaseProps = { children?: any[] } & Attributes;
  export type Component<T = {}, K = T & BaseProps> = (props: K) => Node;
  export type Element = {
    fn: Component;
    props: object;
    el?: Node;
  };
}

export type Attributes = {
  id?: string;
  style?: Record<string, string>;
  className?: string;
  onClick?: (e?: MouseEvent) => void;
  onMouseEnter?: (e?: MouseEvent) => void;
  onMouseLeave?: (e?: MouseEvent) => void;
  onMouseOver?: (e?: MouseEvent) => void;
  onMouseOut?: (e?: MouseEvent) => void;
  onBlur?: (e?: MouseEvent) => void;
};
