import parseCharge, { CHARGE_REGEX, MAX_EXPONENT } from "./parseCharge"

describe("parseCharge", () => {
	it.each([
		["3", "3"],
		["-3", "-3"],
		["+3", "3"],
		["3q", "3"],
		["3Q", "3"],
		[" -1.5q ", "-3/2"],
		["0.1", "1/10"],
		[".5", "1/2"],
		["5.", "5"],
		["2e-3", "1/500"],
		["1.5E3", "1500"],
		["1e+2", "100"],
		["1e-7", "1/10000000"],
		["1e21", "1000000000000000000000"],
		["123456789012345678901234567890", "123456789012345678901234567890"],
		["-0", "0"]
	])("parses %j as %s", (value, expected) => {
		expect(parseCharge(value)?.toFraction()).toBe(expected)
	})

	it.each(["", " ", "q", "-", ".", "abc", "1,5", "1.2.3", "1e", "e5", "1qq", "--1", "1 q 2"])("rejects %j", (value) => {
		expect(parseCharge(value)).toBeNull()
	})

	it("rejects exponents beyond the supported limit", () => {
		expect(parseCharge(`1e${MAX_EXPONENT}`)).not.toBeNull()
		expect(parseCharge(`1e${MAX_EXPONENT + 1}`)).toBeNull()
		expect(parseCharge(`1e-${MAX_EXPONENT + 1}`)).toBeNull()
	})

	it("uses a pattern that browsers accept for the input element", () => {
		const pattern = new RegExp(`^(?:${CHARGE_REGEX.source})$`, "v")

		expect(pattern.test("-1.5e-3q")).toBe(true)
		expect(pattern.test("1,5")).toBe(false)
	})
})
