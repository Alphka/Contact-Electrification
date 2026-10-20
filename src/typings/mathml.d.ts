import type { DetailedHTMLProps, HTMLAttributes } from "react"

type MathMLProps = DetailedHTMLProps<HTMLAttributes<MathMLElement>, MathMLElement>

declare module "react" {
	namespace JSX {
		interface IntrinsicElements {
			mi: MathMLProps
			mn: MathMLProps
			mo: MathMLProps
			math: MathMLProps & { display?: "block" | "inline" }
			mfrac: MathMLProps
		}
	}
}
