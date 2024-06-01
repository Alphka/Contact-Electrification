import type { CorpoInfo, CorposProps } from "."
import type { KeyboardEventHandler } from "react"
import { memo, useCallback, useRef, useState } from "react"
import { FaTrash } from "react-icons/fa6"
import { twJoin } from "tailwind-merge"
import style from "../styles.module.scss"

const chargeRegex = /^ *-?(?:\d(?:\.?\d*)?|\.\d+)(?:[eE][\-+]?(?:\d(?:\.?\d*)?|\.\d+))?[qQ]? *$/.toString().slice(1, -1)

type CorpoProps = Omit<CorposProps, "corposList" | "defaultCorpos" | "alphabet" | "AdicionarCorpo"> & CorpoInfo & {
	letter: string
	canDelete: boolean
	focusPreviousInput: (id: CorpoInfo["id"]) => void
	focusNextInput: (id: CorpoInfo["id"], createInput?: boolean) => void
}

const Corpo = memo(function Corpo({
	id,
	letter,
	inputRef,
	canDelete,
	focusPreviousInput,
	focusNextInput,
	ModificarCorpo,
	RemoverCorpo
}: CorpoProps){
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
		focusNextInput(id)
		RemoverCorpo(id)
	}, [container, focusNextInput, RemoverCorpo])

	const handleEnter: KeyboardEventHandler<HTMLInputElement> = useCallback((event) => {
		const { key, shiftKey } = event

		if(key === "Enter"){
			event.preventDefault()
			if(shiftKey) focusPreviousInput(id)
			else focusNextInput(id, true)
		}
	}, [id, focusNextInput])

	return (
		<li className="flex items-center justify-between gap-2" ref={ref}>
			<label className="flex items-center justify-between gap-1">
				<h3 className="flex-shrink-0 w-4 text-lg font-normal select-none cursor-pointer">
					{letterUpper}
				</h3>

				<input
					type="text"
					className={twJoin(style.corpo, focused && style.focused)}
					aria-label={`Corpo ${letterUpper}`}
					placeholder={`Carga do corpo ${letterUpper}`}
					pattern={chargeRegex}
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
					title="Remover corpo"
					className="flex-shrink-0 block bg-slate-600 text-white aspect-square rounded-md p-2 hover:bg-slate-700 focus:bg-slate-800 focus:text-opacity-80 transition-colors"
					aria-label={`Remover o corpo ${letterUpper}`}
					onClick={handleRemove}
				>
					<FaTrash />
				</button>
			)}
		</li>
	)
})

export default Corpo
