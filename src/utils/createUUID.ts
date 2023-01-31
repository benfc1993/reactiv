import { benchmark } from './benchmark';
import _ from 'lodash';

export const CreateUUID = (
  props: any[],
  element: Node | null,
  cache: any[]
) => {
  const str = _.toString(props) + _.toString(element) + _.toString(cache);
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
