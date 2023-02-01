import { debug } from '../debugConfig'

export const benchmark = <T>(fn: () => T, label: string): T => {
	if (debug.benchmark) console.time(label)
	const res = fn()
	if (debug.benchmark) console.timeEnd(label)
	return res
}
