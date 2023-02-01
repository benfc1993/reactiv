import { TreeNode } from '../globals'

const createTextElement = (text: string): Partial<TreeNode> => {
	return {
		type: 'TEXT_ELEMENT',
		props: {
			nodeValue: text,
			children: []
		}
	}
}

function jsxPragma(
	type: string,
	props: Record<string, any>,
	...children: any[]
): Partial<TreeNode> {
	const response = {
		type,
		props: {
			...props,
			children: children.flatMap((child) =>
				typeof child === 'object' ? child : createTextElement(child)
			)
		}
	}

	return response
}

export default jsxPragma
