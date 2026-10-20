import { ALPHABET } from "@app/constants"
import parseContact from "./parseContact"
import parseCharge from "./parseCharge"
import InputError from "@entities/InputError"
import Fraction from "fraction.js"

export interface ICalculation {
	total: Fraction
	results: Fraction[]
}

/**
 * Applies each contact in order: the touching bodies share their summed charge equally,
 * and later contacts use the updated charges.
 * @throws {InputError} When a charge or a contact is invalid.
 */
export default function calculate(bodies: readonly string[], contacts: readonly string[]): ICalculation{
	const charges = bodies.map((value, index) => {
		const charge = parseCharge(value)

		if(!charge) throw new InputError("invalidCharge", { type: "body", index }, { body: ALPHABET[index] })

		return charge
	})

	const total = charges.reduce((sum, charge) => sum.add(charge), new Fraction(0))

	const results = contacts.map((value, index) => {
		const field = { type: "contact", index } as const
		const contact = index + 1
		const letters = parseContact(value)

		if(!letters) throw new InputError("invalidContact", field, { contact })

		const indexes = new Set<number>()

		for(const letter of letters){
			const bodyIndex = ALPHABET.indexOf(letter)

			if(bodyIndex >= charges.length) throw new InputError("unknownBody", field, { contact, body: letter })
			if(indexes.has(bodyIndex)) throw new InputError("repeatedBody", field, { contact, body: letter })

			indexes.add(bodyIndex)
		}

		let sum = new Fraction(0)

		for(const bodyIndex of indexes) sum = sum.add(charges[bodyIndex])

		const result = sum.div(indexes.size)

		for(const bodyIndex of indexes) charges[bodyIndex] = result

		return result
	})

	return { results, total }
}
