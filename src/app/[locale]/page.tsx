import { getTranslations } from "next-intl/server"
import { hasLocale } from "next-intl"
import { notFound } from "next/navigation"
import { routing } from "@i18n/routing"
import Calculator from "@components/Calculator"

export default async function Home({ params }: PageProps<"/[locale]">){
	const { locale } = await params

	if(!hasLocale(routing.locales, locale)) notFound()

	const t = await getTranslations("calculator")

	return (
		<main className="flex flex-col items-center gap-8 px-2 py-8 sm:px-4 md:pt-12 lg:pt-16">
			<h1 className="text-center text-2xl font-bold md:text-3xl/snug lg:text-4xl/snug">
				{t("title")}
			</h1>

			<Calculator />
		</main>
	)
}
