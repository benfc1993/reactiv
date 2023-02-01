import { useEffect } from '../Reactiv/hooks/useEffect'
import { SetValue, useState } from '../Reactiv/hooks/useState'

type UseStorage<T> = [
	value: T | undefined,
	setValue: SetValue<T | undefined>,
	removeValue: () => void
]

type StorageType = 'local' | 'session'

export const useStorage = <T>(
	initialData: T,
	storageKey: string,
	storageType: StorageType = 'local'
): UseStorage<T> => {
	const storage = storageType === 'local' ? localStorage : sessionStorage
	const initialise = (): T => {
		const data = storage.getItem(storageKey)
		if (data !== null) return JSON.parse(data)

		if (typeof initialData === 'function') {
			return initialData()
		}
		return initialData
	}
	const [value, setValue] = useState<T | undefined>(initialise())

	useEffect(() => {
		if (value === undefined) return storage.removeItem(storageKey)
		storage.setItem(storageKey, JSON.stringify(value))
	}, [storage, storageKey, value])

	const removeValue = () => {
		setValue(undefined)
	}

	return [value, setValue, removeValue]
}
