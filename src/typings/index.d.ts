import "@total-typescript/ts-reset"

declare global {
	var baseURL: URL

	namespace NodeJS {
		interface ProcessEnv {
			VERCEL_URL?: string
		}
	}
}
