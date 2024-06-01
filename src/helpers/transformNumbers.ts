import getExponential from "./getExponential"

export default function transformNumbers(a: number, b: number, exponential?: number){
	exponential ??= getExponential(a, b)

	const [aBase, aExponential] = a.toExponential().split("e").map(Number)
	const [bBase, bExponential] = b.toExponential().split("e").map(Number)

	return [
		aBase * 10 ** (aExponential + exponential),
		bBase * 10 ** (bExponential + exponential)
	] as [number, number]
}
