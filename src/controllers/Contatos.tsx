"use client"

import { memo, useCallback, useState } from "react"
import { twJoin } from "tailwind-merge"

export interface ContatoInfo {
	id: string
	contato: string[]
}

interface ContatosProps {
	contatosList: ContatoInfo[]
}

interface ContatoProps {
	position: number
	contato: string[]
}

const Contato = memo(function Contato({ position, contato }: ContatoProps){
	const [focused, setFocused] = useState(false)
	const [empty, setEmpty] = useState(true)

	const handleKeyPress = useCallback<React.KeyboardEventHandler<HTMLInputElement>>(event => {
		const { currentTarget: input } = event
		const value = input.value.trim()

		if(value !== input.value) input.value = value

		if(!value){
			setEmpty(true)
			return
		}

		setEmpty(false)
	}, [empty])

	const handleFocus = useCallback(() => setFocused(true), [focused])

	return <li>
		<label className="flex items-center justify-between gap-1">
			<span className="w-5 select-none">{position}.</span>
			<input
				className={twJoin("corpo", empty && "empty")}
				type="text"
				defaultValue={contato.join(",")}
				placeholder="Ex: A, B, C"
				pattern="^(?:[a-zA-Z] *, *)+ *[a-zA-Z] *$"
				onFocus={handleFocus}
				onKeyPress={handleKeyPress} />
		</label>
	</li>
})

export default function Contatos({ contatosList }: ContatosProps){
	return (
		<ul className="flex flex-col gap-2 px-4">
			{contatosList.map(({ id, contato }, index) => <Contato {...{
				position: index + 1,
				contato
			}} key={id} />)}
		</ul>
	)
}
