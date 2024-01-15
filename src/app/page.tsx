"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Corpos from "../controllers/Corpos"

export default function Home(){
	const defaultCorpos = 2

	const quantityRef = useRef<HTMLInputElement>(null)

	const [corpos, setCorpos] = useState(defaultCorpos)

	const handleInput = useCallback<React.ChangeEventHandler<HTMLInputElement>>(event => {
		const { currentTarget: input } = event

		event.preventDefault()

		if(!input.checkValidity()){
			input.reportValidity()
			return
		}

		setCorpos(Number(input.value))
	}, [corpos])

	useEffect(() => {
		const input = quantityRef.current

		if(input){
			input.onwheel = event => {
				if(input === document.activeElement) event.stopPropagation()
			}

			return () => {
				input.onwheel = null
			}
		}
	}, [quantityRef.current])

	return (
		<main className="flex flex-col items-center gap-8 py-8 px-2 sm:px-4">
			<section className="divisor">
				<header>
					<h2 className="text-center text-2xl font-bold">
						<label htmlFor="quantity">Quantidade de corpos:</label>
					</h2>
				</header>

				<input
					type="number"
					id="quantity"
					className="block bg-gray-700 rounded-md py-1 px-2 w-12 text-center max-w-xl sm:min-w-min"
					defaultValue={defaultCorpos}
					min={2}
					max={26}
					step={1}
					onInput={handleInput}
					onChange={handleInput}
					ref={quantityRef}
					required />
			</section>

			<section className="divisor">
				<header>
					<h2 className="text-center text-2xl">Corpos</h2>
				</header>

				<Corpos {...{ corpos }} />
			</section>

			<section className="divisor">
				<header>
					<h2 className="text-center text-2xl">Contatos</h2>
				</header>

				<ul></ul>

				<button className="bg-gray-600 py-2 px-4 rounded-md select-none">Adicionar contato</button>
			</section>

			<button className="bg-slate-700 py-2 px-8 rounded-lg select-none" type="submit">Enviar</button>
		</main>
	)
}
