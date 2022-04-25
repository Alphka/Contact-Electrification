import math from "./mathjs"

declare global {
    interface Window{
		math: typeof math
	}
}
