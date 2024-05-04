import type { UUID } from "crypto"
import { memo, useCallback, useState } from "react"
import { FaTrash } from "react-icons/fa6"
import { twJoin } from "tailwind-merge"
import style from "./styles.module.scss"

export interface ContatoInfo {
	id: UUID
	value: string[]
	error?: boolean
}

type ContatoProps = Omit<ContatosProps, "contatosList"> & ContatoInfo & {
	canDelete: boolean
	position: number
}

const Contato = memo(function Contato({
	id,
	position,
	canDelete,
	AdicionarContato,
	RemoverContato,
	ModificarContato
}: ContatoProps){
	const [focused, setFocused] = useState(false)

	const handleChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>(event => {
		const { currentTarget: input } = event
		const value = input.value.trim()

		if(!value) return

		if(!input.checkValidity()){
			input.reportValidity()
			ModificarContato(id, { error: true })
			return
		}

		ModificarContato(id, {
			value: value.split(",").map(e => e.trim()).filter(Boolean),
			error: false
		})
	}, [ModificarContato])

	const handleFocus = useCallback(() => setFocused(true), [])

	const handleDelete = useCallback(() => RemoverContato(id), [RemoverContato])

	return (
		<li>
			<label className="flex items-center justify-between gap-2">
				<h3 className="text-lg font-normal w-6 text-right select-none">
					{position}.
				</h3>

				<input
					className={twJoin(
						style.contato,
						focused && style.focused
					)}
					type="text"
					aria-label={`Contato ${position}`}
					placeholder="Exemplo: A, B, C"
					pattern="^(?:[a-zA-Z] *, *)+ *[a-zA-Z] *$"
					onFocus={handleFocus}
					onChange={handleChange}
					required
				/>

				{canDelete && (
					<button
						className="block bg-slate-600 text-white aspect-square rounded-md p-2 focus-within:bg-gray-800 focus-within:text-gray-400"
						aria-label={`Remover o contato ${position}`}
						title="Remover contato"
						onClick={handleDelete}
					>
						<FaTrash />
					</button>
				)}
			</label>
		</li>
	)
})

export type AdicionarContato = () => void
export type RemoverContato = (id: ContatoInfo["id"]) => void
export type ModificarContato = (id: ContatoInfo["id"], { value, error }: Partial<Omit<ContatoInfo, "id">>) => void

interface ContatosProps {
	contatosList: ContatoInfo[]
	AdicionarContato: AdicionarContato
	RemoverContato: RemoverContato
	ModificarContato: ModificarContato
}

export default function Contatos({ contatosList, ...props }: ContatosProps){
	const canDelete = contatosList.length > 1

	return (
		<ul className="flex flex-col gap-2 px-2 sm:px-4">
			{contatosList.map((info, index) => (
				<Contato {...{
					...info,
					...props,
					canDelete,
					position: index + 1
				}} key={info.id} />
			))}
		</ul>
	)
}
