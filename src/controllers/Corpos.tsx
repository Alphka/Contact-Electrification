"use client"

import { memo, useCallback, useState } from "react"
import { twJoin } from "tailwind-merge"

export type CorpoValue = undefined | number

interface CorposProps {
	corposList: CorpoValue[]
}

const alphabet = "abcdefghijklmnopqrstuvwxyz"

const Corpo = memo(({ index }: { index: number }) => {
	const [focused, setFocused] = useState(false)
	const letter = alphabet[index]

	const handleKeyPress = useCallback(() => {
		// Verificar carga
	}, [])

	const handleFocus = useCallback(() => setFocused(true), [focused])

	return (
		<li>
			<label className="flex items-center justify-between gap-1">
				<span className="w-3.5 select-none">{letter.toUpperCase()}</span>
				<input
					className={twJoin("contato", focused && "focused")}
					type="text"
					name={letter}
					placeholder="Carga"
					onFocus={handleFocus}
					onKeyPress={handleKeyPress} />
			</label>
		</li>
	)
})

export default function Corpos({ corposList }: CorposProps){
	const children = new Array<JSX.Element>

	for(let i = 0, { length } = corposList; i !== length; i++){
		children.push(<Corpo index={i} key={i} />)
	}

	return (
		<ul className="flex flex-col gap-2 px-4">
			{children}
		</ul>
	)
}
