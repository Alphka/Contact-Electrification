import type { IBodiesProps, IBodyInfo } from "."
import type { KeyboardEventHandler } from "react"
import type { UUID } from "node:crypto"
import { memo, useCallback, useRef, useState } from "react"
import { FaTrash } from "react-icons/fa6"
import { twJoin } from "tailwind-merge"
import styles from "../styles.module.css"

const CHARGE_REGEX = /^ *-?(?:\d+\.\d*|\d+|\.\d+)(?:[eE][\-+]?(?:\d+\.\d*|\d+|\.\d+))?[qQ]? *$/v

interface IBodyProps extends Pick<IBodiesProps, "modifyBody" | "removeBody">, IBodyInfo {
	focusPreviousInput: (id: UUID) => void
	focusNextInput: (id: UUID, createInput?: boolean) => void
	canDelete: boolean
	letter: string
}

const Body = memo(function Body({
	focusPreviousInput,
	focusNextInput,
	modifyBody,
	removeBody,
	canDelete,
	inputRef,
	letter,
	value,
	id
}: IBodyProps){
	const [focused, setFocused] = useState(false)
	const ref = useRef<HTMLLIElement>(null)

	const letterUpper = letter.toUpperCase()

	const handleChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>((event) => {
		const { currentTarget: input } = event
		const inputValue = input.value.trim()

		if(!inputValue) return

		if(!input.checkValidity()){
			input.reportValidity()

			modifyBody(id, {
				error: true,
				value,
				inputRef
			})

			return
		}

		modifyBody(id, {
			error: false,
			value: inputValue,
			inputRef
		})
	}, [id, value, inputRef, modifyBody])

	const handleFocus = useCallback(() => setFocused(true), [])

	const handleRemove = useCallback(() => {
		focusNextInput(id)
		removeBody(id)
	}, [id, focusNextInput, removeBody])

	const handleEnter: KeyboardEventHandler<HTMLInputElement> = useCallback((event) => {
		const { key, shiftKey } = event

		if(key === "Enter"){
			event.preventDefault()

			if(shiftKey) focusPreviousInput(id)
			else focusNextInput(id, true)
		}
	}, [id, focusNextInput, focusPreviousInput])

	return (
		<li className="flex items-center justify-between gap-2" ref={ref}>
			<label className="flex items-center justify-between gap-1">
				<h3 className="shrink-0 w-4 text-lg font-normal select-none cursor-pointer">
					{letterUpper}
				</h3>

				<input
					type="text"
					className={twJoin(styles.body, focused && styles.focused)}
					aria-label={`Corpo ${letterUpper}`}
					placeholder={`Carga do corpo ${letterUpper}`}
					pattern={CHARGE_REGEX.source}
					onFocus={handleFocus}
					// eslint-disable-next-line @typescript-eslint/no-deprecated
					onKeyPress={handleEnter}
					onChange={handleChange}
					required
					ref={inputRef}
				/>
			</label>

			{canDelete && (
				<button
					type="button"
					title="Remover corpo"
					className="shrink-0 block bg-slate-600 text-white aspect-square rounded-md p-2 hover:bg-slate-700 focus:bg-slate-800 focus:text-white/80 transition-colors"
					aria-label={`Remover o corpo ${letterUpper}`}
					onClick={handleRemove}
				>
					<FaTrash />
				</button>
			)}
		</li>
	)
})

export default Body
