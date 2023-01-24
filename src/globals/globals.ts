import { Globals } from './types';

export const globals: Globals = {
  renderOrder: [],
  currId: '0',
  set currentId(value: string) {
    this.currId = value;
  },
  get currentId(): string {
    return this.currId;
  },
  currentNodeIndex: 0,
  incrementCurrentId() {
    this.currentNodeIndex += 1;
    this.currentId = this.renderOrder[this.currentNodeIndex];
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
  componentElements: {}
};
