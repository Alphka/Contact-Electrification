/* eslint-disable @typescript-eslint/naming-convention */

declare global {
	var baseURL: URL

	interface globalThis {
		baseURL: URL
	}

	namespace NodeJS {
		interface ProcessEnv {
			VERCEL_URL?: string
		}
	}
}

export {}
