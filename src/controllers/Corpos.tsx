import type { UUID } from "crypto"
import { memo, useCallback, useState } from "react"
import { FaTrash } from "react-icons/fa6"
import { twJoin } from "tailwind-merge"

export type CorpoInfo = {
	id: UUID
	value: string
}

const alphabet = "abcdefghijklmnopqrstuvwxyz"
const quantityRegex = /^ *(?:\d(?:\.?\d*)?|\.\d+)(?:e[\-+]?[\d.]+)?[qQ]? *$/.toString().slice(1, -1)

type CorpoProps = Pick<CorposProps, "AdicionarCorpo" | "RemoverCorpo" | "ModificarCorpo"> & CorpoInfo & {
	index: number
	canDelete: boolean
}

const Corpo = memo(({
	id,
	index,
	canDelete,
	AdicionarCorpo,
	RemoverCorpo,
	ModificarCorpo
}: CorpoProps) => {
	const [focused, setFocused] = useState(false)
	const [empty, setEmpty] = useState(true)
	const letter = alphabet[index]

	const handleChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>(event => {
		const { currentTarget: input } = event
		const value = input.value.trim()

		if(!value){
			setEmpty(true)
			return
		}

		setEmpty(false)

		ModificarCorpo(id, value)
	}, [ModificarCorpo])

	const handleFocus = useCallback(() => setFocused(true), [])

	const handleRemove = useCallback(() => RemoverCorpo(id), [RemoverCorpo])

	return (
		<li className="flex items-center justify-between gap-2">
			<label className="flex items-center justify-between gap-1">
				<span className="w-3.5 select-none cursor-pointer">
					{letter.toUpperCase()}
				</span>

				<input
					className={twJoin(
						"contato",
						focused && "focused",
						empty && "empty"
					)}
					type="text"
					name={letter}
					pattern={quantityRegex}
					placeholder="Carga"
					onFocus={handleFocus}
					onChange={handleChange} />
			</label>

			{canDelete && (
				<button
					className="block bg-slate-600 text-white aspect-square rounded-md p-2 focus-within:bg-gray-800 focus-within:text-gray-400"
					aria-label={`Remover o corpo ${letter}`}
					title="Remover corpo"
					onClick={handleRemove}
				>
					<FaTrash />
				</button>
			)}
		</li>
	)
})

interface CorposProps {
	corposList: CorpoInfo[]
	defaultCorpos: number
	AdicionarCorpo: () => void
	RemoverCorpo: (id: UUID) => void
	ModificarCorpo: (id: UUID, value: CorpoInfo["value"]) => void
}

export default function Corpos({ corposList, defaultCorpos, AdicionarCorpo, RemoverCorpo, ModificarCorpo }: CorposProps){
	const canDelete = corposList.length > defaultCorpos

	return (
		<ul className="flex flex-col gap-2 px-4">
			{corposList.map((info, index) =>
				<Corpo {...{
					...info,
					index,
					canDelete,
					AdicionarCorpo,
					RemoverCorpo,
					ModificarCorpo
				}} key={info.id} />
			)}
		</ul>
	)
}
