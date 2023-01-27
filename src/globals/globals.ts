import { Globals } from './types';

export const globals: Globals = {
  renderOrder: [],
  parId: '0',
  set parentId(value: string) {
    this.parId = value;
  },
  get parentId(): string {
    return this.parId;
  },
  currentNodeIndex: 0,
  get currentId(): string | null {
    return this.renderOrder[this.currentNodeIndex] || null;
  },
  incrementCurrentId() {
    this.currentNodeIndex += 1;
  },
  hasRend: false,
  set hasRendered(value: boolean) {
    this.hasRend = value;
  },
  get hasRendered(): boolean {
    return this.hasRend;
  },
  currentStateIndex: 0,
  incrementCurrentStateIndex() {
    this.currentStateIndex += 1;
  },
  resetCurrentStateIndex() {
    this.currentStateIndex = 0;
  },
  componentElements: {},
  getCurrentComponentElement() {
    return this.componentElements[this.currentId!];
  }
};
