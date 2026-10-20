import type { ComponentProps } from "react"
import { screen } from "@testing-library/react"
import LanguageSwitcher from "./LanguageSwitcher"
import renderWithIntl from "@testing/renderWithIntl"

jest.mock("../../i18n/navigation", () => ({
	Link: ({ locale, href, ...props }: ComponentProps<"a"> & { locale: string }) => (
		<a href={`/${locale}${String(href)}`} {...props} />
	)
}))

describe("LanguageSwitcher", () => {
	it("links to every locale and marks the current one", () => {
		renderWithIntl(<LanguageSwitcher />)

		const navigation = screen.getByRole("navigation", { name: "Language" })
		const english = screen.getByRole("link", { name: "English" })
		const portuguese = screen.getByRole("link", { name: "Português (Brasil)" })

		expect(navigation).toContainElement(english)
		expect(english).toHaveAttribute("aria-current", "page")
		expect(english).toHaveAttribute("hreflang", "en")
		expect(portuguese).not.toHaveAttribute("aria-current")
		expect(portuguese).toHaveAttribute("lang", "pt-BR")
		expect(portuguese).toHaveAttribute("href", "/pt-BR/")
	})
})
