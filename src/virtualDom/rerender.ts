import _ from 'lodash';
import { TreeNode, globals } from '../globals';
import { processTree, queue } from './createTree';
import { loudLog } from '../utils/loudLog';

export const rerender = (startElement: TreeNode) => {
  //   queue.push(startElement);
  //   loudLog('rerender', _.cloneDeep(startElement));
  //   console.time('CreateVirtualDom');
  //   requestIdleCallback((deadline: IdleDeadline) =>
  //     processTree(deadline, startElement)
  //   );
};
