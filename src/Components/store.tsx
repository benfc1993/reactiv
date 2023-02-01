import { createContext } from '../Reactiv/Context/createContext'
import { SetValue, useState } from '../Reactiv/hooks/useState'

export const TestContext = createContext<[number, SetValue<number>]>()

export const useStore = (initialValue: number): [number, SetValue<number>] => {
	const [value, setValue] = useState(initialValue)
	return [value, setValue]
}
