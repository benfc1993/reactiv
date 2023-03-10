import { createTree } from './virtualDom/createTree'

export let rootNode!: HTMLElement

export const CreateDOM = (rootId: string, rootFn: Node) => {
	console.time('CreateVirtualDom')

	const tryGetRootNode = document.getElementById(rootId)
	if (tryGetRootNode) {
		createTree(tryGetRootNode, rootFn)
	} else {
		throw new Error(`No Root node found with id: ${rootId}`)
	}
}
