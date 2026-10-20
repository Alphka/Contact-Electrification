import InputError from "@entities/InputError"
import calculate from "./calculate"

function calculateFractions(bodies: string[], contacts: string[]){
	const { results, total } = calculate(bodies, contacts)

	return {
		results: results.map((result) => result.toFraction()),
		total: total.toFraction()
	}
}

function catchInputError(callback: () => unknown){
	try{
		callback()
	}catch(error){
		if(error instanceof InputError) return error
		throw error
	}

	throw new Error("Expected an InputError to be thrown")
}

describe("calculate", () => {
	it("shares the charge of two bodies equally", () => {
		expect(calculateFractions(["-3q", "5q"], ["A, B"])).toEqual({ results: ["1"], total: "2" })
	})

	it("uses the charges left by previous contacts", () => {
		expect(calculateFractions(["4", "0", "0"], ["A, B", "A, C", "B, C"])).toEqual({
			results: ["2", "1", "3/2"],
			total: "4"
		})
	})

	it("keeps repeating fractions exact across contacts", () => {
		expect(calculateFractions(["1", "0", "0", "0"], ["A, B, C", "A, B", "A, D"])).toEqual({
			results: ["1/3", "1/3", "1/6"],
			total: "1"
		})
	})

	it("adds decimal charges without floating-point errors", () => {
		expect(calculateFractions(["0.1", "0.2"], ["A, B"])).toEqual({ results: ["3/20"], total: "3/10" })
	})

	it("handles scientific notation", () => {
		expect(calculateFractions(["1e-7", "0"], ["A, B"])).toEqual({ results: ["1/20000000"], total: "1/10000000" })
	})

	it("accepts lower-case letters", () => {
		expect(calculateFractions(["2", "4"], ["a, b"]).results).toEqual(["3"])
	})

	it("keeps the total charge constant", () => {
		const { results, total } = calculateFractions(["7", "-2", "1.5"], ["A, B", "B, C", "A, B, C"])

		expect(total).toBe("13/2")
		expect(results.at(-1)).toBe("13/6")
	})

	it.each([
		{ bodies: ["1", ""], contacts: ["A, B"], code: "invalidCharge", field: { type: "body", index: 1 }, values: { body: "B" } },
		{ bodies: ["x", "1"], contacts: ["A, B"], code: "invalidCharge", field: { type: "body", index: 0 }, values: { body: "A" } },
		{ bodies: ["1", "2"], contacts: ["A, B", ""], code: "invalidContact", field: { type: "contact", index: 1 }, values: { contact: 2 } },
		{ bodies: ["1", "2"], contacts: ["A"], code: "invalidContact", field: { type: "contact", index: 0 }, values: { contact: 1 } },
		{ bodies: ["1", "2"], contacts: ["A, C"], code: "unknownBody", field: { type: "contact", index: 0 }, values: { contact: 1, body: "C" } },
		{ bodies: ["1", "2"], contacts: ["A, b, a"], code: "repeatedBody", field: { type: "contact", index: 0 }, values: { contact: 1, body: "A" } }
	])("throws $code for bodies $bodies and contacts $contacts", ({ bodies, contacts, code, field, values }) => {
		const error = catchInputError(() => calculate(bodies, contacts))

		expect(error).toBeInstanceOf(Error)
		expect(error).toMatchObject({ code, field, values })
	})
})
