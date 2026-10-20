import { getRequestConfig } from "next-intl/server"
import { hasLocale } from "next-intl"
import { routing } from "./routing"
import * as rootParams from "next/root-params"

// eslint-disable-next-line unicorn/no-top-level-side-effects
export default getRequestConfig(async ({ locale }) => {
	if(!locale){
		const paramValue = await rootParams.locale()

		locale = hasLocale(routing.locales, paramValue) ? paramValue : routing.defaultLocale
	}

	return {
		locale,
		messages: (await import(`../../messages/${locale}.json`)).default
	}
})
