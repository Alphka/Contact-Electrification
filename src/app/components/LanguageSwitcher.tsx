import { useLocale, useTranslations } from "next-intl"
import { routing } from "@i18n/routing"
import { Link } from "@i18n/navigation"

export default function LanguageSwitcher(){
	const currentLocale = useLocale()
	const t = useTranslations("languageSwitcher")

	return (
		<nav aria-label={t("label")}>
			<ul className="flex gap-1 rounded-lg bg-gray-800 p-1 text-sm">
				{routing.locales.map((locale) => (
					<li key={locale}>
						<Link
							href="/"
							locale={locale}
							hrefLang={locale}
							lang={locale}
							className="block rounded-md px-3 py-1 transition-colors hover:bg-gray-700 aria-[current=page]:bg-slate-600"
							aria-current={locale === currentLocale ? "page" : undefined}
						>
							{t(locale)}
						</Link>
					</li>
				))}
			</ul>
		</nav>
	)
}
