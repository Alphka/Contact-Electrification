import type { RefObject } from "react"
import type { UUID } from "node:crypto"
import type Fraction from "@entities/Fraction"
import { ALPHABET, DEFAULT_BODIES_LENGTH } from "@app/constants"
import { memo, useCallback } from "react"
import Body from "./Body"

export interface IBodyInfo {
	id: UUID
	error?: boolean
	value: string
	fraction?: Fraction
	inputRef: RefObject<HTMLInputElement | null>
}

export interface IBodiesProps {
	bodiesList: IBodyInfo[]
	modifyBody: (id: UUID, info: Omit<IBodyInfo, "id">) => void
	removeBody: (id: UUID) => void
	addBody: (quantity?: number) => void
}

const Bodies = memo(function Bodies({
	bodiesList,
	modifyBody,
	removeBody,
	addBody
}: IBodiesProps){
	const canDelete = bodiesList.length > DEFAULT_BODIES_LENGTH

	const focusNextInput = useCallback((id: UUID, createInput = false) => {
		const corpoIndex = bodiesList.findIndex((corpo) => corpo.id === id)

		if(corpoIndex === -1) throw new Error(`Corpo (${id}) not found`)

		const nextCorpo = bodiesList.at(corpoIndex + 1)

		if(nextCorpo) nextCorpo.inputRef.current?.focus()
		else if(createInput) addBody()
	}, [bodiesList, addBody])

	const focusPreviousInput = useCallback((id: UUID) => {
		const corpoIndex = bodiesList.findIndex((corpo) => corpo.id === id)

		if(corpoIndex === -1) throw new Error(`Corpo (${id}) not found`)
		if(corpoIndex === 0) return

		bodiesList.at(corpoIndex - 1)?.inputRef.current?.focus()
	}, [bodiesList])

	return (
		<ul className="flex flex-col gap-2 px-2 sm:px-4">
			{bodiesList.map((info, index) => (
				<Body
					letter={ALPHABET[index]}
					{...info}
					{...{
						canDelete,
						modifyBody,
						removeBody,
						focusNextInput,
						focusPreviousInput
					}}
					key={info.id}
				/>
			))}
		</ul>
	)
})

export default Bodies
