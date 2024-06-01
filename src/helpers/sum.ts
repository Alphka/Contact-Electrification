import transformNumbers from "./transformNumbers"
import getExponential from "./getExponential"

export default function sum(a: number, b: number){
	if(a % 1 + b % 1 === 0) return a + b

	const exponential = getExponential(a, b)

	;[a, b] = transformNumbers(a, b, exponential)

	return (a + b) / 10 ** exponential
}
