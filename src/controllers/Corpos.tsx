import type { UUID } from "crypto"
import { memo, useCallback, useRef, useState } from "react"
import { FaTrash } from "react-icons/fa6"
import { twJoin } from "tailwind-merge"
import style from "./styles.module.scss"

export interface CorpoInfo {
	id: UUID
	value: string
	error?: boolean
}

const chargeRegex = /^ *(?:\d(?:\.?\d*)?|\.\d+)(?:e[\-+]?(?:\d(?:\.?\d*)?|\.\d+))?[qQ]? *$/.toString().slice(1, -1)

type CorpoProps = Omit<CorposProps, "corposList" | "defaultCorpos" | "alphabet"> & CorpoInfo & {
	letter: string
	canDelete: boolean
}

const Corpo = memo(({
	id,
	letter,
	canDelete,
	AdicionarCorpo,
	RemoverCorpo,
	ModificarCorpo
}: CorpoProps) => {
	const [focused, setFocused] = useState(false)
	const ref = useRef<HTMLLIElement>(null)

	const container = ref.current
	const letterUpper = letter.toUpperCase()

	const handleChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>(event => {
		const { currentTarget: input } = event
		const value = input.value.trim()

		if(!value) return

		if(!input.checkValidity()){
			input.reportValidity()
			ModificarCorpo(id, { error: true })
			return
		}

		ModificarCorpo(id, { value, error: false })
	}, [ModificarCorpo])

	const handleFocus = useCallback(() => setFocused(true), [])

	const handleRemove = useCallback(() => {
		if(container){
			const sibling = container.nextElementSibling

			if(sibling instanceof HTMLLIElement){
				sibling.querySelector<HTMLInputElement>(`input.${style.corpo}`)?.focus()
			}
		}

		RemoverCorpo(id)
	}, [container, RemoverCorpo])

	return (
		<li className="flex items-center justify-between gap-2" ref={ref}>
			<label className="flex items-center justify-between gap-1">
				<h3 className="flex-shrink-0 w-4 text-lg font-normal select-none cursor-pointer">
					{letterUpper}
				</h3>

				<input
					className={twJoin(
						style.corpo,
						focused && style.focused
					)}
					type="text"
					name={letter}
					aria-label={`Corpo ${letterUpper}`}
					pattern={chargeRegex}
					placeholder={`Carga do corpo ${letterUpper}`}
					onFocus={handleFocus}
					onChange={handleChange}
					required
				/>
			</label>

			{canDelete && (
				<button
					className="flex-shrink-0 block bg-slate-600 text-white aspect-square rounded-md p-2 hover:bg-slate-700 focus:bg-slate-800 focus:text-opacity-80 transition-colors"
					aria-label={`Remover o corpo ${letterUpper}`}
					title="Remover corpo"
					onClick={handleRemove}
				>
					<FaTrash />
				</button>
			)}
		</li>
	)
})

export type AdicionarCorpo = (quantity?: number) => void
export type RemoverCorpo = (id: UUID) => void
export type ModificarCorpo = (id: UUID, { value, error }: Partial<Omit<CorpoInfo, "id">>) => void

export interface CorposProps {
	alphabet: string
	corposList: CorpoInfo[]
	defaultCorpos: number
	AdicionarCorpo: AdicionarCorpo
	RemoverCorpo: RemoverCorpo
	ModificarCorpo: ModificarCorpo
}

export default function Corpos({ corposList, defaultCorpos, alphabet, ...props }: CorposProps){
	const canDelete = corposList.length > defaultCorpos

	return (
		<ul className="flex flex-col gap-2 px-2 sm:px-4">
			{corposList.map((info, index) =>
				<Corpo {...{
					...info,
					...props,
					letter: alphabet[index],
					canDelete
				}} key={info.id} />
			)}
		</ul>
	)
}
