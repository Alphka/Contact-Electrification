import type { IContactInfo, IContactsProps } from "."
import type { KeyboardEventHandler } from "react"
import type { UUID } from "node:crypto"
import { memo, useCallback, useState } from "react"
import { FaTrash } from "react-icons/fa6"
import { twJoin } from "tailwind-merge"
import styles from "../styles.module.css"

interface IContactProps extends Pick<IContactsProps, "modifyContact" | "removeContact">, IContactInfo {
	focusPreviousInput: (id: UUID) => void
	focusNextInput: (id: UUID, createInput?: boolean) => void
	canDelete: boolean
	position: number
}

const Contact = memo(function Contact({
	focusPreviousInput,
	focusNextInput,
	modifyContact,
	removeContact,
	canDelete,
	position,
	inputRef,
	value,
	id
}: IContactProps){
	const [focused, setFocused] = useState(false)

	const handleChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>((event) => {
		const { currentTarget: input } = event
		const inputValue = input.value.trim()

		if(!inputValue) return

		if(!input.checkValidity()){
			input.reportValidity()

			modifyContact(id, {
				error: true,
				value,
				inputRef
			})

			return
		}

		modifyContact(id, {
			value: inputValue.split(",").map((e) => e.trim()).filter(Boolean),
			error: false,
			inputRef
		})
	}, [id, value, inputRef, modifyContact])

	const handleFocus = useCallback(() => setFocused(true), [])

	const handleDelete = useCallback(() => {
		focusNextInput(id)
		removeContact(id)
	}, [id, focusNextInput, removeContact])

	const handleEnter: KeyboardEventHandler<HTMLInputElement> = useCallback((event) => {
		const { key, shiftKey } = event

		if(key === "Enter"){
			event.preventDefault()
			if(shiftKey) focusPreviousInput(id)
			else focusNextInput(id, true)
		}
	}, [id, focusNextInput, focusPreviousInput])

	return (
		<li className="flex items-center justify-between gap-2">
			<label className="flex items-center justify-between gap-1">
				<h3 className="text-lg font-normal w-6 text-right select-none">
					{position}.
				</h3>

				<input
					type="text"
					className={twJoin(styles.contact, focused && styles.focused)}
					aria-label={`Contato ${position}`}
					placeholder="Exemplo: A, B, C"
					pattern="^(?:[a-zA-Z] *, *)+ *[a-zA-Z] *$"
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

export default Contact
