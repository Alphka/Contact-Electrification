import type { MutableRefObject } from "react"
import type { UUID } from "crypto"
import { memo, useCallback } from "react"
import Contato from "./Contato"

export interface ContatoInfo {
	id: UUID
	value: string[]
	error?: boolean
	inputRef: MutableRefObject<HTMLInputElement | null>
}

export type AdicionarContato = () => void
export type RemoverContato = (id: ContatoInfo["id"]) => void
export type ModificarContato = (id: ContatoInfo["id"], { value, error }: Partial<Omit<ContatoInfo, "id">>) => void

export interface ContatosProps {
	contatosList: ContatoInfo[]
	AdicionarContato: AdicionarContato
	ModificarContato: ModificarContato
	RemoverContato: RemoverContato
}

const Contatos = memo(function Contatos({ contatosList, AdicionarContato, ModificarContato, RemoverContato }: ContatosProps){
	const canDelete = contatosList.length > 1

	const focusNextInput = useCallback((id: ContatoInfo["id"], createInput = false) => {
		const contatoIndex = contatosList.findIndex(corpo => corpo.id === id)

		if(contatoIndex === -1) throw new Error(`Corpo (${id}) not found`)

		const nextContato = contatosList.at(contatoIndex + 1)

		if(nextContato) nextContato.inputRef.current?.focus()
		else if(createInput) AdicionarContato()
	}, [contatosList, AdicionarContato])

	const focusPreviousInput = useCallback((id: ContatoInfo["id"]) => {
		const contatoIndex = contatosList.findIndex(corpo => corpo.id === id)

		if(contatoIndex === -1) throw new Error(`Corpo (${id}) not found`)
		if(contatoIndex === 0) return

		contatosList.at(contatoIndex - 1)?.inputRef.current?.focus()
	}, [contatosList])

	return (
		<ul className="flex flex-col gap-2 px-2 sm:px-4">
			{contatosList.map((info, index) => (
				<Contato {...{
					...info,
					position: index + 1,
					focusPreviousInput,
					focusNextInput,
					ModificarContato,
					RemoverContato,
					canDelete
				}} key={info.id} />
			))}
		</ul>
	)
})

export default Contatos
