import { TreeNode, TreeNodeAction } from '../globals'
import { updateNode } from './reconcileNode'
import { loudLog } from '../utils/loudLog'
import { debug } from '../debugConfig'

let rerendered = 0
export const commitVirtualDom = (tree: TreeNode | null) => {
	if (!tree) return
	rerendered = 0
	commitElement(tree)
	if (debug.benchmark) console.timeEnd('commit virtual DOM')
	loudLog('Rerendered Elements: ', rerendered)
}
const commitElement = (tree: TreeNode | null) => {
	if (!tree) return
	let parentElement: TreeNode | null = tree.parent

	while (!parentElement?.domElement) {
		parentElement = parentElement?.parent ?? null
	}

	const parentDomElement = parentElement?.domElement

	if (tree.action === TreeNodeAction.ADD && tree.domElement) {
		rerendered++
		parentDomElement.appendChild(tree.domElement)
	}

	if (tree.action === TreeNodeAction.UPDATE && tree.domElement) {
		updateNode(
			tree?.prev?.domElement as HTMLElement,
			tree.prev?.props,
			tree.props
		)
		rerendered++
	}

	commitElement(tree.child)
	commitElement(tree.sibling)
}
