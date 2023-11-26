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
			<label>
				<span>{letter.toUpperCase()}</span>
				<input type="text" name={letter} onKeyPress={handleKeyPress} />
			</label>
		</li>
	)
})

export default function Corpos({ corpos }: CorposProps){
	return (
		<ul>
			{Array.from(new Array(corpos), (_, index) => (
				<Corpo index={index} key={index} />
			))}
		</ul>
	)
}