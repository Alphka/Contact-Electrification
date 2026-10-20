import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"

const config: NextConfig = {
	cacheComponents: true,
	partialPrefetching: true,
	experimental: {
		typedEnv: true
	},
	headers(){
		return [
			{
				source: "/:path*",
				headers: [
					{
						key: "Permissions-Policy",
						value: "camera=(), microphone=(), geolocation=(), interest-cohort=()"
					},
					{
						key: "X-Content-Type-Options",
						value: "nosniff"
					},
					{
						key: "X-DNS-Prefetch-Control",
						value: "on"
					},
					{
						key: "X-Frame-Options",
						value: "DENY"
					}
				]
			}
		]
	},
	productionBrowserSourceMaps: true,
	reactStrictMode: true,
	typedRoutes: true
}

const withNextIntl = createNextIntlPlugin({
	experimental: {
		messages: {
			path: "./messages",
			format: "json",
			locales: "infer",
			precompile: true
		},
		createMessagesDeclaration: [
			"./messages/en.json",
			"./messages/pt-BR.json"
		]
	}
})

// eslint-disable-next-line unicorn/no-top-level-side-effects
export default withNextIntl(config)
