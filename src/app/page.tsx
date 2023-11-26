"use client"

import { useCallback, useState } from "react"
import Corpos from "../controllers/Corpos"

export default function Home(){
	const [corpos, setCorpos] = useState(0)

	const handleInput = useCallback<React.ChangeEventHandler<HTMLInputElement>>(event => {
		const { currentTarget: input } = event

		event.preventDefault()

		if(!input.checkValidity()){
			input.reportValidity()
			return
		}

		setCorpos(Number(input.value))
	}, [corpos])

	const handleInputScroll = useCallback<React.WheelEventHandler<HTMLInputElement>>(event => {
		const { currentTarget: input } = event

		if(document.activeElement === input){
			event.nativeEvent.stopPropagation()
			event.nativeEvent.preventDefault()
		}
	}, [document.activeElement])

	return (
		<main className="flex flex-col items-center gap-8 py-8 px-2 sm:px-4">
			<section className="relative flex flex-col items-center gap-4 w-full mb-4 after:absolute after:-bottom-6 after:bg-slate-400 after:w-3/4 after:h-px">
				<header>
					<h2 className="text-center text-2xl font-bold">
						<label htmlFor="quantity">Quantidade de corpos:</label>
					</h2>
				</header>

				<input
					type="number"
					id="quantity"
					className="block bg-gray-700 rounded-md py-1 px-2 w-2/3 max-w-xl sm:min-w-min"
					defaultValue={2}
					min={2}
					max={26}
					step={1}
					onInput={handleInput}
					onChange={handleInput}
					onWheel={handleInputScroll}
					required />
			</section>

			<section className="relative flex flex-col items-center gap-4 w-full mb-4 after:absolute after:-bottom-6 after:bg-slate-400 after:w-3/4 after:h-px">
				<header>
					<h2 className="text-center text-2xl">Corpos</h2>
				</header>

				<Corpos {...{ corpos }} />
			</section>

			<section className="relative flex flex-col items-center gap-4 w-full mb-4 after:absolute after:-bottom-6 after:bg-slate-400 after:w-3/4 after:h-px">
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
