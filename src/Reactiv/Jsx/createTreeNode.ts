import { TreeNode, TreeNodeAction } from '../globals'

export const createTreeNode = (values: Partial<TreeNode>): TreeNode => {
	const newTreeNode: TreeNode = {
		type: null,
		child: null,
		sibling: null,
		parent: null,
		element: null,
		domElement: null,
		props: null,
		cache: [],
		action: TreeNodeAction.ADD,
		prev: null,
		...values
	}

	return newTreeNode
}
