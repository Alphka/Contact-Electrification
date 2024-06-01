import type { ContatoInfo, ContatosProps } from "."
import type { KeyboardEventHandler } from "react"
import { memo, useCallback, useState } from "react"
import { FaTrash } from "react-icons/fa6"
import { twJoin } from "tailwind-merge"
import style from "../styles.module.scss"

type ContatoProps = Omit<ContatosProps, "contatosList" | "AdicionarContato"> & ContatoInfo & {
	position: number
	canDelete: boolean
	focusPreviousInput: (id: ContatoInfo["id"]) => void
	focusNextInput: (id: ContatoInfo["id"], createInput?: boolean) => void
}

const Contato = memo(function Contato({
	id,
	position,
	inputRef,
	canDelete,
	focusPreviousInput,
	focusNextInput,
	ModificarContato,
	RemoverContato
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

	const handleDelete = useCallback(() => {
		focusNextInput(id)
		RemoverContato(id)
	}, [focusNextInput, RemoverContato])

	const handleEnter: KeyboardEventHandler<HTMLInputElement> = useCallback((event) => {
		const { key, shiftKey } = event

		if(key === "Enter"){
			event.preventDefault()
			if(shiftKey) focusPreviousInput(id)
			else focusNextInput(id, true)
		}
	}, [id, focusNextInput])

	return (
		<li className="flex items-center justify-between gap-2">
			<label className="flex items-center justify-between gap-1">
				<h3 className="text-lg font-normal w-6 text-right select-none">
					{`${position}.`}
				</h3>

				<input
					type="text"
					className={twJoin(style.contato, focused && style.focused)}
					aria-label={`Contato ${position}`}
					placeholder="Exemplo: A, B, C"
					pattern="^(?:[a-zA-Z] *, *)+ *[a-zA-Z] *$"
					onFocus={handleFocus}
					onKeyPress={handleEnter}
					onChange={handleChange}
					ref={inputRef}
					required
				/>
			</label>

			{canDelete && (
				<button
					type="button"
					title="Remover contato"
					className="block bg-slate-600 text-white aspect-square rounded-md p-2 focus-within:bg-gray-800 focus-within:text-gray-400"
					aria-label={`Remover o contato ${position}`}
					onClick={handleDelete}
				>
					<FaTrash />
				</button>
			)}
		</li>
	)
})

export default Contato
