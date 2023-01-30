import _ from 'lodash';
import { TreeElement, globals } from '../globals';
import { processTree, queue } from './createTree';
import { loudLog } from '../utils/loudLog';

export const rerender = (startElement: TreeElement) => {
  queue.push(startElement);
  loudLog('rerender', _.cloneDeep(startElement));
  console.time('CreateVirtualDom');
  requestIdleCallback((deadline: IdleDeadline) =>
    processTree(deadline, startElement)
  );
};
