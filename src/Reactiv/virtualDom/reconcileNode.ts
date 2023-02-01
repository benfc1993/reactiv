const domProps = (key: string) => key !== 'children' && !key.startsWith('on')
const events = (key: string) => key.startsWith('on')

export const updateNode = (
	domElement: HTMLElement,
	prevProps: Record<string, any> | null | undefined,
	newProps: Record<string, any> | null | undefined
) => {
	if (!prevProps || !newProps) return
	updateAttributes(domElement, prevProps, newProps)
	updateEventListeners(domElement, prevProps, newProps)
}

const updateAttributes = (
	domElement: HTMLElement,
	prevProps: Record<string, any>,
	newProps: Record<string, any>
) => {
	Object.keys(prevProps)
		.filter(domProps)
		.forEach((key) => ((domElement as any)[key] = ''))

	Object.keys(newProps)
		.filter(domProps)
		.forEach((key) => ((domElement as any)[key] = newProps[key]))
}

const updateEventListeners = (
	domElement: HTMLElement,
	prevProps: Record<string, EventListenerOrEventListenerObject>,
	newProps: Record<string, EventListenerOrEventListenerObject>
) => {
	Object.keys(prevProps)
		.filter(events)
		.forEach((key) => {
			domElement.removeEventListener(key, prevProps[key])
		})

	Object.keys(newProps)
		.filter(events)
		.forEach((key) => {
			domElement.addEventListener(key, prevProps[key])
		})
}
