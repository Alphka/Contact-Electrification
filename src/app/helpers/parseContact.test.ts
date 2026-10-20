import parseContact from "./parseContact"

describe("parseContact", () => {
	it.each([
		["A, B", ["A", "B"]],
		["a,b,c", ["A", "B", "C"]],
		["  A ,  b  ", ["A", "B"]],
		["A, A", ["A", "A"]]
	])("parses %j", (value, expected) => {
		expect(parseContact(value)).toEqual(expected)
	})

	it.each(["", "A", "A,", ",A", "A B", "AB, C", "A, 1", "A;B", "Á, B"])("rejects %j", (value) => {
		expect(parseContact(value)).toBeNull()
	})
})
