import type Fraction from "fraction.js"

interface IChargeProps {
	value: Fraction
}

export default function Charge({ value }: IChargeProps){
	const numerator = value.n.toString()

	return (
		<math>
			{value.s < 0n && <mo>−</mo>}
			{value.d === 1n ? <mn>{numerator}</mn> : (
				<mfrac>
					<mn>{numerator}</mn>
					<mn>{value.d.toString()}</mn>
				</mfrac>
			)}
			<mi>q</mi>
		</math>
	)
}
