import { render } from "@testing-library/react"
import Fraction from "fraction.js"
import Charge from "./Charge"

describe("Charge", () => {
	it("renders an integer charge", () => {
		const { container } = render(<Charge value={new Fraction(5)} />)

		expect(container.querySelector("mfrac")).toBeNull()
		expect(container).toHaveTextContent("5q")
	})

	it("renders a negative fraction as MathML", () => {
		const { container } = render(<Charge value={new Fraction(-1, 3)} />)
		const fraction = container.querySelector("math mfrac")

		expect(fraction?.children).toHaveLength(2)
		expect(container.querySelector("mo")).toHaveTextContent("−")
		expect(container).toHaveTextContent("−13q")
	})
})
