import { routing } from "./i18n/routing"
import createMiddleware from "next-intl/middleware"

// eslint-disable-next-line unicorn/no-top-level-side-effects
export default createMiddleware(routing)

export const config = {
	matcher: "/((?!api|_next|_vercel|.*\\..*).*)"
}
