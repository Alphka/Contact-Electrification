import type { MutableRefObject } from "react"
import type { UUID } from "crypto"
import { memo, useCallback } from "react"
import Corpo from "./Corpo"

export interface Fraction {
	numerator: number
	denominator: number
}

export interface CorpoInfo {
	id: UUID
	value: string
	error?: boolean
	fraction?: Fraction
	inputRef: MutableRefObject<HTMLInputElement | null>
}

export type AdicionarCorpo = (quantity?: number) => void
export type RemoverCorpo = (id: UUID) => void
export type ModificarCorpo = (id: UUID, { value, error }: Partial<Omit<CorpoInfo, "id">>) => void

export interface CorposProps {
	alphabet: string
	corposList: CorpoInfo[]
	defaultCorpos: number
	AdicionarCorpo: AdicionarCorpo
	ModificarCorpo: ModificarCorpo
	RemoverCorpo: RemoverCorpo
}

const Corpos = memo(function Corpos({ alphabet, defaultCorpos, corposList, AdicionarCorpo, ModificarCorpo, RemoverCorpo }: CorposProps){
	const canDelete = corposList.length > defaultCorpos

	const focusNextInput = useCallback((id: CorpoInfo["id"], createInput = false) => {
		const corpoIndex = corposList.findIndex(corpo => corpo.id === id)

		if(corpoIndex === -1) throw new Error(`Corpo (${id}) not found`)

		const nextCorpo = corposList.at(corpoIndex + 1)

		if(nextCorpo) nextCorpo.inputRef.current?.focus()
		else if(createInput) AdicionarCorpo()
	}, [corposList, AdicionarCorpo])

	const focusPreviousInput = useCallback((id: CorpoInfo["id"]) => {
		const corpoIndex = corposList.findIndex(corpo => corpo.id === id)

		if(corpoIndex === -1) throw new Error(`Corpo (${id}) not found`)
		if(corpoIndex === 0) return

		corposList.at(corpoIndex - 1)?.inputRef.current?.focus()
	}, [corposList])

	return (
		<ul className="flex flex-col gap-2 px-2 sm:px-4">
			{corposList.map((info, index) =>
				<Corpo {...{
					...info,
					letter: alphabet[index],
					focusPreviousInput,
					focusNextInput,
					ModificarCorpo,
					RemoverCorpo,
					canDelete
				}} key={info.id} />
			)}
		</ul>
	)
})

export default Corpos
