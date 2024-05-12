/** Euclidean Algorithm to find the greatest common divisor (GCD) */
export function FindDivisor(a: number, b: number){
	while(b !== 0){
		const temp = b
		b = a % b
		a = temp
	}

	return a
}

export default class Fraction {
	numerator: number
	denominator: number

	constructor(numerator: number, denominator: number){
		const divisor = FindDivisor(numerator, denominator)

		this.numerator = numerator / divisor
		this.denominator = denominator / divisor
	}

	toString(){
		const { numerator, denominator } = this
		if(denominator === 1) return numerator + "q"
		return numerator + "q/" + denominator
	}
}
