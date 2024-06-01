/** Euclidean Algorithm to find the greatest common divisor (GCD) */
export default function findDivisor(a: number, b: number){
	while(b !== 0){
		const temp = b
		b = a % b
		a = temp
	}

	return a
}
