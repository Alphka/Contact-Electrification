import type { Metadata, Viewport } from "next"
import type { ReactNode } from "react"
import { GoogleAnalytics } from "@next/third-parties/google"
import { ToastContainer } from "react-toastify"
import { Analytics } from "@vercel/analytics/next"
import { Poppins } from "next/font/google"

import "./globals.scss"

const poppins = Poppins({
	weight: ["300", "400", "500", "600", "700"],
	subsets: ["latin", "latin-ext"],
	display: "swap"
})

const title = "Eletrização por contato"
const description = "Um site que calcula a carga de dois ou mais objetos após serem tocados."

export const viewport: Viewport = {
	themeColor: "#111827",
	// @ts-ignore
	colorScheme: "dark only"
}

global.baseURL = new URL("https://contact-electrification.vercel.app")

export const metadata: Metadata = {
	title,
	description,
	applicationName: title,
	metadataBase: global.baseURL,
	openGraph: {
		title,
		description,
		type: "website",
		locale: "pt_BR"
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

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="pt-BR">
			<body className={`${poppins.className} bg-gray-900`}>
				{children}
				<ToastContainer theme="dark" autoClose={5e3} pauseOnHover={false} pauseOnFocusLoss={false} />
				<Analytics />
				<GoogleAnalytics gaId="G-YE3KFJ29H4" />
			</body>
		</html>
	)
}
