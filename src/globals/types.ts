import { Reactiv } from '../types';

export interface Globals {
  hasRendered: boolean;
  hasRend: boolean;
  renderOrder: string[];
  parentId: string;
  currentStateIndex: number;
  currentNodeIndex: number;
  currentId: string | null;
  incrementCurrentId: () => void;
  incrementCurrentStateIndex: () => void;
  resetCurrentStateIndex: () => void;
  componentElements: {
    [id: string]: Reactiv.Element;
  };
  getCurrentComponentElement: () => Reactiv.Element;
}
