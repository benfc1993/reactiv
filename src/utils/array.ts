declare global {
  export interface Array<T> {
    last(): T;
    removeAt(index: number): Array<T>;
    insert(value: T, index: number): Array<T>;
  }
}

Array.prototype.last = function <T>(): T {
  return this[this.length - 1];
};

Array.prototype.insert = function <T>(value: T, index: number): Array<T> {
  if (index === -1) throw new Error('index must be greater than -1');
  if (index > this.length) {
    this.push(value);
    return this;
  }
  const start = this.slice(0, index);
  const end = this.slice(index + 1);
  return [...start, value, ...end];
};

Array.prototype.removeAt = function <T>(index: number): Array<T> {
  if (index === -1) return this;
  const start = this.slice(0, index);
  const end = this.slice(index + 1);
  return [...start, ...end];
};

export {};
