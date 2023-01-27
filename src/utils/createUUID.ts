import { benchmark } from './benchmark';

export const CreateUUID = (
  fn: string,
  prevHash: string | null,
  column: number,
  layer: number
) => {
  const str = fn + (prevHash || '') + column.toString() + layer.toString();
  return benchmark(() => quickHash(str), 'CreateUUID');
};

export const quickHash = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash &= hash;
  }

  return new Uint32Array([hash])[0].toString(36);
};
