import type { Metadata, Viewport } from "next"
import type { ReactNode } from "react"
import { Poppins } from "next/font/google"

import "./globals.scss"

const poppins = Poppins({
	weight: ["400", "500", "600", "700"],
	subsets: ["latin"]
})

const title = "Eletrização por contato"
const description = "Um site que calcula a carga de dois ou mais objetos após serem tocados."

export const viewport: Viewport = {
	themeColor: "#111827",
	colorScheme: "dark"
}

const metadataBase = new URL(process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://contact-electrification.vercel.app")

export const metadata: Metadata = {
	title,
	description,
	metadataBase,
	openGraph: {
		title,
		description,
		type: "website",
		locale: "pt_BR"
	},
	other: {
		"darkreader-lock": "true"
	},
	robots: {
		index: true
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
			<body className={`${poppins.className} bg-gray-900`}>{children}</body>
		</html>
	)
}
