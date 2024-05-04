import type { UUID } from "crypto"
import { memo, useCallback, useState } from "react"
import { FaTrash } from "react-icons/fa6"
import { twJoin } from "tailwind-merge"

export interface ContatoInfo {
	id: UUID
	contato: string[]
}

interface ContatosProps {
	contatosList: ContatoInfo[]
	RemoverContato: (id: ContatoInfo["id"]) => void
	ModificarContato: (id: ContatoInfo["id"], contato: ContatoInfo["contato"]) => void
}

type ContatoProps = ContatoInfo & Omit<ContatosProps, "contatosList"> & {
	position: number
}

function Contato({ id, position, RemoverContato, ModificarContato }: ContatoProps){
	const [focused, setFocused] = useState(false)
	const [empty, setEmpty] = useState(true)

	const handleChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>(event => {
		const { currentTarget: input } = event
		const value = input.value.trim()

		if(!value){
			setEmpty(true)
			return
		}

		setEmpty(false)

		if(input.checkValidity()){
			ModificarContato(id, value.split(",").filter(Boolean))
		}
	}, [ModificarContato])

	const handleFocus = useCallback(() => setFocused(true), [])

	const handleDelete = useCallback(() => RemoverContato(id), [RemoverContato])

	return <li>
		<label className="flex items-center justify-between gap-2">
			<span className="text-lg w-6 text-right select-none">{position}.</span>

			<input
				className={twJoin(
					"corpo",
					focused && "focused",
					empty && "empty"
				)}
				type="text"
				placeholder="Ex: A, B, C"
				pattern="^(?:[a-zA-Z] *, *)+ *[a-zA-Z] *$"
				onFocus={handleFocus}
				onChange={handleChange}
			/>

			<button
				className="block bg-slate-600 text-white aspect-square rounded-md p-2 focus-within:bg-gray-800 focus-within:text-gray-400"
				title="Remover contato"
				onClick={handleDelete}
			>
				<FaTrash />
			</button>
		</label>
	</li>
}

export default function Contatos({ contatosList, ...props }: ContatosProps){
	return (
		<ul className="flex flex-col gap-2 px-4">
			{contatosList.map(({ id, contato }, index) => <Contato {...{
				id,
				position: index + 1,
				contato,
				...props
			}} key={id} />)}
		</ul>
	)
}
