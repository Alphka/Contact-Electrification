"use client"

import { memo, useCallback } from "react"

interface CorposProps {
	corpos: number
}

const alphabet = "abcdefghijklmnopqrstuvwxyz"

const Corpo = memo(({ index }: { index: number }) => {
	const letter = alphabet[index]

	const handleKeyPress = useCallback(() => {
		// Verificar carga
	}, [])

	return (
		<li>
			<label className="flex items-center justify-between gap-1">
				<span className="w-3.5">{letter.toUpperCase()}</span>
				<input className="block bg-gray-800 rounded-md py-1 px-2 max-[300px]:w-full w-50 sm:w-60" type="text" name={letter} onKeyPress={handleKeyPress} />
			</label>
		</li>
	)
})

export default function Corpos({ corpos }: CorposProps){
	const children = new Array<JSX.Element>

	for(let i = 0; i !== corpos; i++){
		children.push(<Corpo index={i} key={i} />)
	}

	return (
		<ul className="flex flex-col gap-2 px-4">
			{children}
		</ul>
	)
}
