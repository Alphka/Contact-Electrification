import type { ReactNode } from "react"
import type { Metadata } from "next"
import { Poppins } from "next/font/google"

import "./globals.scss"

const poppins = Poppins({
	weight: ["400", "500", "600"],
	subsets: ["latin"]
})

const title = "Contact Eletrification"
const description = title

const metadataBase = new URL(process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://contact-electrification.vercel.app")

export const metadata: Metadata = {
	title,
	description,
	metadataBase,
	themeColor: "#111827",
	openGraph: {
		title,
		description,
		type: "website",
		locale: "pt_BR"
	},
	icons: [
		{ rel: "icon", type: "image/png", sizes: "32x32", url: new URL("/favicon.png", metadataBase) },
		{ rel: "icon", type: "image/svg+xml", sizes: "any", url: new URL("/favicon.svg", metadataBase) }
	],
	other: {
		"darkreader-lock": "true"
	},
	robots: {
		index: true
	},
	authors: {
		name: "Kayo Souza"
	},
	colorScheme: "dark",
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
