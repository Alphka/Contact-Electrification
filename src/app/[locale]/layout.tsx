import type { Metadata, Viewport } from "next"
import { hasLocale, NextIntlClientProvider } from "next-intl"
import { getLocale, getTranslations } from "next-intl/server"
import { GoogleAnalytics } from "@next/third-parties/google"
import { ToastContainer } from "react-toastify"
import { getPathname } from "@i18n/navigation"
import { Analytics } from "@vercel/analytics/next"
import { BASE_URL } from "@app/constants"
import { poppins } from "@app/fonts"
import { routing } from "@i18n/routing"
import LanguageSwitcher from "@components/LanguageSwitcher"
import "../globals.css"

const OPEN_GRAPH_LOCALES = {
	en: "en_US",
	"pt-BR": "pt_BR"
} satisfies Record<typeof routing.locales[number], string>

export const viewport: Viewport = {
	themeColor: "#111827",
	colorScheme: "dark"
}

export function generateStaticParams(){
	return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata(): Promise<Metadata>{
	const locale = await getLocale()
	const t = await getTranslations("metadata")
	const title = t("title")
	const description = t("description")

	return {
		title,
		description,
		applicationName: title,
		metadataBase: BASE_URL,
		alternates: {
			canonical: getPathname({ href: "/", locale }),
			languages: {
				...Object.fromEntries(routing.locales.map((alternate) => [alternate, getPathname({ href: "/", locale: alternate })])),
				"x-default": getPathname({ href: "/", locale: routing.defaultLocale })
			}
		},
		openGraph: {
			title,
			description,
			type: "website",
			locale: OPEN_GRAPH_LOCALES[locale]
		},
		other: {
			"darkreader-lock": "true",
			"google-site-verification": "XpkrkTQ3rzFCPLIhzroakWwXaH22Jai1u1w6lxgWHJk"
		},
		robots: {
			index: true,
			follow: true
		},
		authors: {
			name: "Kayo Souza"
		},
		generator: "Next.js",
		referrer: "origin-when-cross-origin"
	}
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">){
	const { locale } = await params

	return (
		<html lang={hasLocale(routing.locales, locale) ? locale : routing.defaultLocale}>
			<body className={`${poppins.className} min-h-dvh bg-gray-900 text-gray-100`}>
				<NextIntlClientProvider>
					<header className="flex justify-end px-2 pt-2 sm:px-4">
						<LanguageSwitcher />
					</header>

					{children}
				</NextIntlClientProvider>

				<ToastContainer
					theme="dark"
					autoClose={5e3}
					pauseOnHover={false}
					pauseOnFocusLoss={false}
				/>

				<Analytics />

				<GoogleAnalytics gaId="G-YE3KFJ29H4" />
			</body>
		</html>
	)
}
