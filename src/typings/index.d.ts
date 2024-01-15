namespace NodeJS {
	interface ProcessEnv {
		NODE_ENV?: "development" | "production"
		PORT?: string
		VERCEL_URL?: string
	}
}

declare module "*.scss" {
	const content: Record<string, string>
	export default content
}
