export default function isNumber(number: any){
	if(number === 0) return true
	if(!number) return false

	number = Number(number)

	return !Number.isNaN(number) && Number.isFinite(number)
}
