import type { NextConfig } from "next"

const config: NextConfig = {
	experimental: {
		typedEnv: true
	},
	headers(){
		return [
			{
				source: "/:path*",
				missing: [
					{ type: "header", key: "next-router-prefetch" },
					{ type: "header", key: "purpose", value: "prefetch" }
				],
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

export default config
