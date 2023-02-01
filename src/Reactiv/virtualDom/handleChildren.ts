import { JSXnode, TreeNode, TreeNodeAction } from '../globals'
import { createTreeNode } from '../Jsx/createTreeNode'

export const handleChildren = (currentNode: TreeNode, children: JSXnode[]) => {
	if (!children) return
	let prevSibling: TreeNode | null = null
	let oldNode = currentNode.prev && currentNode.prev.child

	for (let i = 0; i < children.length; i++) {
		const child = children[i]
		const action = nodeActionType(oldNode, child)

		let newNode: TreeNode | null = null

		switch (action) {
			case TreeNodeAction.ADD:
				newNode = createTreeNode({
					type: child.type,
					props: child.props,
					parent: currentNode,
					action
				})
				newNode.prev = newNode
				break
			case TreeNodeAction.UPDATE:
				newNode = createTreeNode({
					type: oldNode?.type,
					cache: oldNode?.cache,
					props: child.props,
					domElement: oldNode?.domElement,
					action,
					parent: currentNode,
					prev: oldNode
				})

				break
			case TreeNodeAction.NONE:
				newNode = oldNode
				break
		}

		if (oldNode) oldNode = oldNode.sibling

		if (i == 0) currentNode.child = newNode
		else if (prevSibling) prevSibling.sibling = newNode

		prevSibling = newNode
	}
}

const nodeActionType = (
	oldNode: TreeNode | null,
	newElement: JSXnode
): TreeNodeAction => {
	const isSame = isSameType(oldNode, newElement)

	if (isSame) {
		return TreeNodeAction.UPDATE
	}

	if (newElement && !isSame) return TreeNodeAction.ADD

	return TreeNodeAction.NONE
}

const isSameType = (oldNode: TreeNode | null, newNode: JSXnode): boolean => {
	return oldNode !== null && newNode && newNode.type == oldNode.type
}
