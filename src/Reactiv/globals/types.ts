import { Component } from '../types'

export type TreeNode = {
	type: object | string | Component | null
	child: TreeNode | null
	sibling: TreeNode | null
	parent: TreeNode | null
	element: Node | null
	domElement: Node | null
	props: Record<string, any> | null
	cache: unknown[]
	fragElements?: Node[]
	fragDomElements?: Node[]
	action: TreeNodeAction
	prev: TreeNode | null
}

export enum TreeNodeAction {
	NONE = 'NONE',
	ADD = 'ADD',
	UPDATE = 'UPDATE'
}

export type JSXnode = {
	type: string | object | Component
	props: Record<string, any>
	children: JSXnode | string[]
}

export interface Globals {
	get tree(): TreeNode
	set tree(value: TreeNode)
	nodeTree: TreeNode
	currentTreeNode: TreeNode
	cacheIndex: number
	resetCacheIndex(): void
	incrementCurrentStateIndex(): void
}
