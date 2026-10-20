import { QUANTITY_COMMIT_DELAY } from "@app/constants"
import { act, screen, within } from "@testing-library/react"
import { toast } from "react-toastify"
import renderWithIntl from "@testing/renderWithIntl"
import Calculator from "./Calculator"
import userEvent from "@testing-library/user-event"

jest.mock("react-toastify", () => ({
	toast: { error: jest.fn() }
}))

function setup(options?: Parameters<typeof userEvent.setup>[0]){
	const user = userEvent.setup(options)

	renderWithIntl(<Calculator />)

	return {
		user,
		body: (letter: string) => screen.getByRole("textbox", { name: `Charge of body ${letter}` }),
		contact: (position: number) => screen.getByRole("textbox", { name: `Contact ${position}` }),
		quantity: () => screen.getByRole("spinbutton", { name: "Number of bodies" }),
		calculate: () => user.click(screen.getByRole("button", { name: "Calculate" }))
	}
}

describe("Calculator", () => {
	beforeEach(() => {
		jest.mocked(toast.error).mockClear()
	})

	it("calculates the contacts and the total charge", async () => {
		const { user, body, contact, calculate } = setup()

		await user.type(body("A"), "1")
		await user.type(body("B"), "0")
		await user.type(contact(1), "A, B")
		await calculate()

		const results = screen.getByRole("region", { name: "Results" })

		expect(within(results).getAllByRole("listitem")).toHaveLength(1)
		expect(results.querySelector("mfrac")).toHaveTextContent("12")
		expect(results).toHaveTextContent("Sum of charges:1q")
		expect(toast.error).not.toHaveBeenCalled()
	})

	it("reports an invalid charge and focuses its input", async () => {
		const { user, body, contact, calculate } = setup()

		await user.type(body("A"), "1")
		await user.type(contact(1), "A, B")
		await calculate()

		expect(toast.error).toHaveBeenCalledWith("Enter a valid charge for body B, such as 3, -1.5q or 2e-3.")
		expect(body("B")).toHaveFocus()
		expect(screen.queryByRole("region", { name: "Results" })).not.toBeInTheDocument()
	})

	it("reports an empty contact", async () => {
		const { user, body, calculate } = setup()

		await user.type(body("A"), "1")
		await user.type(body("B"), "2")
		await calculate()

		expect(toast.error).toHaveBeenCalledWith("Contact 1 must list at least two bodies separated by commas, such as A, B.")
	})

	it("does not reuse a charge after its input is cleared", async () => {
		const { user, body, contact, calculate } = setup()

		await user.type(body("A"), "1")
		await user.type(body("B"), "2")
		await user.type(contact(1), "A, B")
		await user.clear(body("B"))
		await calculate()

		expect(toast.error).toHaveBeenCalledWith("Enter a valid charge for body B, such as 3, -1.5q or 2e-3.")
	})

	it("grows the bodies list while typing and shrinks it only when the quantity is committed", async () => {
		const { user, body, quantity } = setup()
		const bodies = () => screen.getAllByRole("textbox", { name: /^Charge of body/v })

		await user.clear(quantity())
		await user.type(quantity(), "5")

		expect(bodies()).toHaveLength(5)

		await user.type(body("E"), "7")
		await user.clear(quantity())
		await user.type(quantity(), "2")

		expect(bodies()).toHaveLength(5)

		await user.type(quantity(), "0")
		await user.tab()

		expect(bodies()).toHaveLength(20)
		expect(body("E")).toHaveValue("7")

		await user.clear(quantity())
		await user.type(quantity(), "3{Enter}")

		expect(bodies()).toHaveLength(3)
		expect(screen.queryByRole("region", { name: "Results" })).not.toBeInTheDocument()
	})

	it("commits the quantity after the user stops typing", async () => {
		jest.useFakeTimers()

		try{
			const { user, quantity } = setup({ advanceTimers: jest.advanceTimersByTime })
			const bodies = () => screen.getAllByRole("textbox", { name: /^Charge of body/v })

			await user.clear(quantity())
			await user.type(quantity(), "6")
			await user.clear(quantity())
			await user.type(quantity(), "4")

			act(() => jest.advanceTimersByTime(QUANTITY_COMMIT_DELAY - 1))

			expect(bodies()).toHaveLength(6)

			act(() => jest.advanceTimersByTime(1))

			expect(bodies()).toHaveLength(4)
			expect(quantity()).toHaveValue(4)

			await user.clear(quantity())
			act(() => jest.advanceTimersByTime(QUANTITY_COMMIT_DELAY))

			expect(bodies()).toHaveLength(4)
			expect(quantity()).not.toHaveValue()
		}finally{
			jest.useRealTimers()
		}
	})

	it("ignores an out-of-range quantity", async () => {
		const { user, quantity } = setup()

		await user.clear(quantity())
		await user.type(quantity(), "30")
		await user.tab()

		expect(screen.getAllByRole("textbox", { name: /^Charge of body/v })).toHaveLength(3)
		expect(quantity()).toHaveValue(3)
	})

	it("adds a body and focuses it when Enter is pressed on the last input", async () => {
		const { user, body } = setup()

		await user.type(body("B"), "1{Enter}")

		expect(body("C")).toHaveFocus()

		await user.keyboard("{Shift>}{Enter}{/Shift}")

		expect(body("B")).toHaveFocus()
	})

	it("only allows removing bodies above the minimum and keeps focus in the list", async () => {
		const { user, body } = setup()

		expect(screen.queryByRole("button", { name: /^Remove body/v })).not.toBeInTheDocument()

		await user.click(screen.getByRole("button", { name: "Add body" }))

		expect(body("C")).toHaveFocus()

		await user.click(screen.getByRole("button", { name: "Remove body C" }))

		expect(screen.queryByRole("textbox", { name: "Charge of body C" })).not.toBeInTheDocument()
		expect(body("B")).toHaveFocus()
	})

	it("clears the contacts", async () => {
		const { user, contact } = setup()

		await user.type(contact(1), "A, B{Enter}")
		await user.type(contact(2), "A, B")
		await user.click(screen.getByRole("button", { name: "Clear contacts" }))

		expect(screen.getAllByRole("textbox", { name: /^Contact/v })).toHaveLength(1)
		expect(contact(1)).toHaveValue("")
	})
})
