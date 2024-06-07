import getExponential from "./getExponential"

export default function transformNumbers(a: number, b: number, exponential?: number): [number, number] {
	exponential ??= getExponential(a, b)

	if(exponential === 0) return [a, b]

	const [aBase, aExponential] = a.toExponential().split("e").map(Number)
	const [bBase, bExponential] = b.toExponential().split("e").map(Number)

	return [
		+(aBase * 10 ** (aExponential + exponential)).toExponential(12),
		+(bBase * 10 ** (bExponential + exponential)).toExponential(12)
	]
}
