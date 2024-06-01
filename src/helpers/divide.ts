import transformNumbers from "./transformNumbers"

export default function divide(a: number, b: number){
	[a, b] = transformNumbers(a, b)

	const result = a / b
	return a > 0 && b > 0 ? +result.toPrecision(12) : result
}
