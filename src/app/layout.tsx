import type { Metadata, Viewport } from "next"
import type { ReactNode } from "react"
import { ToastContainer } from "react-toastify"
import { Analytics } from "@vercel/analytics/next"
import { Poppins } from "next/font/google"

import "react-toastify/dist/ReactToastify.css"
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

const url = "https://" + (process.env.VERCEL_URL ? process.env.VERCEL_URL : "contact-electrification.vercel.app")

export const metadata: Metadata = {
	title,
	description,
	applicationName: title,
	metadataBase: new URL(url),
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
			<body className={`${poppins.className} bg-gray-900`}>
				{children}
				<ToastContainer theme="dark" autoClose={2000} pauseOnHover={false} pauseOnFocusLoss={false} />
				<Analytics/>
			</body>
		</html>
	)
}
