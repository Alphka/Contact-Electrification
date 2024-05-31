export default function deepEqualArray(a: unknown[], b: unknown[]): a is typeof b {
	if(!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false

	for(let i = 0, { length } = a; i < length; i++){
		if(a[i] !== b[i]) return false
	}

	return true
}
