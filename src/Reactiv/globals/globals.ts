import { Globals, TreeNode, TreeNodeAction } from './types'

const blankTree: TreeNode = {
	type: 'root',
	child: null,
	sibling: null,
	parent: null,
	element: null,
	domElement: null,
	props: null,
	cache: [],
	action: TreeNodeAction.NONE,
	prev: null
}

export const globals: Globals = {
	nodeTree: blankTree,
	get tree() {
		return this.nodeTree
	},
	set tree(value) {
		this.nodeTree = value
	},
	currentTreeNode: blankTree,
	cacheIndex: 0,
	resetCacheIndex() {
		this.cacheIndex = 0
	},
	incrementCurrentStateIndex() {
		this.cacheIndex++
	}
}
