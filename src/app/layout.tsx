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

export const metadata: Metadata = {
	title,
	description,
	themeColor: "#0D0D0D",
	openGraph: {
		title,
		description,
		type: "website",
		locale: "pt_BR"
	},
	icons: [
		{ rel: "icon", type: "image/png", sizes: "32x32", url: "/favicon.png" },
		{ rel: "icon", type: "image/svg+xml", sizes: "any", url: "/favicon.svg" }
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
