export namespace Reactiv {
  export type BaseProps = { children?: any[] } & Attributes;
  export type Component<T = {}, K = T & BaseProps> = (props: K) => Node;
  export type Element = {
    fn: Component;
    props: object;
    el?: Node;
    parentId: string;
    parentElement?: Node;
    isFragment: boolean;
    fragmentChildren: Node[];
    cache: any[];
    nodeTree: {
      layer: number;
      column: number;
      nextHash: string;
    };
  };
}

export type Attributes = {
  id?: string;
  style?: Record<string, string>;
  className?: string;
  ref?: { current: Node | null };
  onClick?: (e?: MouseEvent) => void;
  onMouseEnter?: (e?: MouseEvent) => void;
  onMouseLeave?: (e?: MouseEvent) => void;
  onMouseOver?: (e?: MouseEvent) => void;
  onMouseOut?: (e?: MouseEvent) => void;
  onBlur?: (e?: MouseEvent) => void;
};
