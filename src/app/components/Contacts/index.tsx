import type { RefObject } from "react"
import type { UUID } from "node:crypto"
import { memo, useCallback } from "react"
import Contact from "./Contact"

export interface IContactInfo {
	id: UUID
	error?: boolean
	value: string[]
	inputRef: RefObject<HTMLInputElement | null>
}

export interface IContactsProps {
	modifyContact: (id: UUID, info: Omit<IContactInfo, "id">) => void
	removeContact: (id: UUID) => void
	contactsList: IContactInfo[]
	addContact: () => void
}

const Contatos = memo(function Contatos({
	modifyContact,
	removeContact,
	contactsList,
	addContact
}: IContactsProps){
	const canDelete = contactsList.length > 1

	const focusNextInput = useCallback((id: UUID, createInput = false) => {
		const contatoIndex = contactsList.findIndex((corpo) => corpo.id === id)

		if(contatoIndex === -1) throw new Error(`Corpo (${id}) not found`)

		const nextContato = contactsList.at(contatoIndex + 1)

		if(nextContato) nextContato.inputRef.current?.focus()
		else if(createInput) addContact()
	}, [contactsList, addContact])

	const focusPreviousInput = useCallback((id: UUID) => {
		const contatoIndex = contactsList.findIndex((corpo) => corpo.id === id)

		if(contatoIndex === -1) throw new Error(`Corpo (${id}) not found`)
		if(contatoIndex === 0) return

		contactsList.at(contatoIndex - 1)?.inputRef.current?.focus()
	}, [contactsList])

	return (
		<ul className="flex flex-col gap-2 px-2 sm:px-4">
			{contactsList.map((info, index) => (
				<Contact
					position={index + 1}
					{...info}
					{...{
						canDelete,
						modifyContact,
						removeContact,
						focusNextInput,
						focusPreviousInput
					}}
					key={info.id}
				/>
			))}
		</ul>
	)
})

export default Contatos
