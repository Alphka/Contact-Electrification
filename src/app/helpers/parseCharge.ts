import Fraction from "fraction.js"

export const CHARGE_REGEX = /^\s*(?<sign>[+\-]?)(?<mantissa>\d+(?:\.\d*)?|\.\d+)(?:[eE](?<exponent>[+\-]?\d+))?\s*(?:[qQ]\s*)?$/v

/** Keeps `10n ** exponent` small enough to compute instantly. */
export const MAX_EXPONENT = 1000

/**
 * Parses a charge such as `3`, `-1.5q` or `2e-3` into an exact fraction.
 * Returns `null` when the value is not a valid charge.
 */
export default function parseCharge(value: string){
	const groups = CHARGE_REGEX.exec(value)?.groups

	if(!groups) return null

	const { sign, mantissa, exponent = "0" } = groups
	const exponentValue = Number(exponent)

	if(Math.abs(exponentValue) > MAX_EXPONENT) return null

	const [integer, decimals = ""] = mantissa.split(".", 2)
	const digits = BigInt(integer + decimals || "0")
	const shift = exponentValue - decimals.length
	const scale = 10n ** BigInt(Math.abs(shift))
	const charge = shift >= 0 ? new Fraction(digits * scale, 1n) : new Fraction(digits, scale)

	return sign === "-" ? charge.neg() : charge
}
