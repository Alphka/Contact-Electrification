export const CONTACT_REGEX = /^\s*[a-zA-Z](?:\s*,\s*[a-zA-Z])+\s*$/v

export default function parseContact(value: string){
	if(!CONTACT_REGEX.test(value)) return null

	return value.split(",").map((letter) => letter.trim().toUpperCase())
}
