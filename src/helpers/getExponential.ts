export default function getExponential(a: number, b: number){
	const aString = a.toString()
	const bString = b.toString()
	const aDotIndex = aString.indexOf(".")
	const bDotIndex = bString.indexOf(".")
	const aDecimal = aDotIndex === -1 ? undefined : aString.substring(aDotIndex + 1)
	const bDecimal = bDotIndex === -1 ? undefined : bString.substring(bDotIndex + 1)

	const decimalLength = (
		aDecimal && bDecimal
			? Math.max(aDecimal.length, bDecimal.length) === aDecimal.length ? aDecimal : bDecimal
			: aDecimal ?? bDecimal
	)?.length || 0

	return decimalLength
}
