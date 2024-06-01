import { isNumber, transformNumbers, findDivisor } from "@helpers"

export default class Fraction {
	sign: number
	numerator: number
	denominator: number

	constructor(numerator: number, denominator: number){
		if(typeof numerator !== "number" || !isNumber(numerator)) throw new TypeError(`Invalid fraction: ${numerator}/${denominator}`)
		if(typeof denominator !== "number" || !isNumber(denominator)) throw new TypeError(`Invalid fraction: ${numerator}/${denominator}`)

		if(denominator === 0) throw new Error("Denominator cannot be zero")

		this.sign = Math.sign(numerator / denominator)
		numerator = Math.abs(numerator)
		denominator = Math.abs(denominator)

		;[numerator, denominator] = transformNumbers(numerator, denominator)

		const divisor = findDivisor(numerator, denominator)

		this.numerator = numerator / divisor
		this.denominator = denominator / divisor
	}

	toString(){
		const { sign, numerator, denominator } = this
		if(denominator === 1) return numerator * sign + "q"
		return numerator * sign + "q/" + denominator
	}
}
