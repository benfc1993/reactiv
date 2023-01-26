import { Reactiv } from '../types';

export interface Globals {
  hasRendered: boolean;
  hasRend: boolean;
  renderOrder: string[];
  currId: string;
  currentId: string;
  currentStateIndex: number;
  currentNodeIndex: number;
  incrementCurrentId: () => void;
  incrementCurrentStateIndex: () => void;
  resetCurrentStateIndex: () => void;
  componentElements: {
    [id: string]: Reactiv.Element;
  };
  getCurrentComponentElement: () => Reactiv.Element;
}
