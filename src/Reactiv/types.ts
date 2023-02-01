export type ReactivNode = HTMLElement | Component
export type BaseProps = { children?: ReactivNode[] } & Attributes
export type Component<T = object, K = T & BaseProps> = (props: K) => Node

export type Attributes = {
	id?: string
	style?: Record<string, string>
	className?: string
	ref?: { current: Node | null }
	type?: string
	onClick?: (e?: MouseEvent) => void
	onMouseEnter?: (e?: MouseEvent) => void
	onMouseLeave?: (e?: MouseEvent) => void
	onMouseOver?: (e?: MouseEvent) => void
	onMouseOut?: (e?: MouseEvent) => void
	onBlur?: (e?: MouseEvent) => void
}
