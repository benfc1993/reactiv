import { useContext } from '../Reactiv/Context/createContext'
import { globals } from '../Reactiv/globals'
import { useEffect } from '../Reactiv/hooks/useEffect'
import { useRef } from '../Reactiv/hooks/useRef'
import { useState } from '../Reactiv/hooks/useState'
import { Component } from '../Reactiv/types'
import { TestContext } from './store'
import './styles.css'

export const Text: Component<{ count: number }> = (attributes) => {
	const { count, ...restProps } = attributes
	const [value, setValue] = useContext(TestContext)
	console.log(globals.tree)

	return (
		<div className='TextTop'>
			<div>
				<p {...restProps}>Count: {count}</p>
				<button onClick={() => setValue((prev) => prev + 5)}>
					Change context {value}
				</button>
				<Button />
			</div>
		</div>
	)
}

export const BasicComponent: Component<{ count: number }> = (
	attributes
): Node => {
	const { count, children, ...restProps } = attributes
	const [value, setValue] = useState(count)
	const ref = useRef<HTMLElement | null>(null)

	const onClick = () => {
		ref.current?.classList.add('active')
	}

	const onOtherClick = () => {
		setValue((prev) => prev + 2)
		ref.current?.classList.remove('active')
	}

	return (
		<div>
			<div {...restProps}>
				<Text count={value} ref={ref} className='Text child' />

				{children}

				<>
					<button onClick={onClick}>On</button>
					<button onClick={onOtherClick}>Off</button>
				</>
			</div>
		</div>
	)
}

export const Button = () => {
	const [value, setValue] = useState(10)

	return (
		<>
			<p>{value}</p>
			<button onClick={() => setValue((current) => current + 1)}>
				Click kid
			</button>
		</>
	)
}
