"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { FaTrash } from "react-icons/fa"
import { v4 as uuidv4 } from "uuid"
import Contatos, { type ContatoInfo } from "../controllers/Contatos"
import Corpos, { type CorpoValue } from "../controllers/Corpos"

export default function Home(){
	const defaultCorpos = 2

	const quantityRef = useRef<HTMLInputElement>(null)

	function SetCorposSize(size: number){
		setCorposList(corposList.slice(0, size))
	}

	function AddCorpos(quantity: number = 1){
		setCorposList([...corposList, ...Array.from(new Array(quantity), () => undefined)])
	}

	function NewContato(){
		return {
			id: uuidv4(),
			contato: []
		} as ContatoInfo
	}

	function AdicionarContato(){
		setContatosList([...contatosList, NewContato()])
	}

	function RemoverContato(id: ContatoInfo["id"]){
		const listClone = contatosList.slice()
		const contatoIndex = listClone.findIndex(e => e.id === id)

		if(contatoIndex !== -1){
			listClone.splice(contatoIndex, 1)
			setContatosList(listClone)
			return true
		}

		return false
	}

	function LimparContatos(){
		setContatosList([NewContato()])
	}

	const [corposList, setCorposList] = useState<CorpoValue[]>(Array.from(new Array(defaultCorpos), () => undefined))
	const [contatosList, setContatosList] = useState<ContatoInfo[]>([NewContato()])

	const handleInput = useCallback<React.ChangeEventHandler<HTMLInputElement>>(event => {
		const { currentTarget: input } = event

		event.preventDefault()

		if(!input.checkValidity()){
			input.reportValidity()
			return
		}

		const { length } = corposList
		const value = Number(input.value)

		if(value < length) SetCorposSize(value)
		else if(value > length) AddCorpos(value - length)
	}, [corposList])

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

				<Corpos {...{ corposList }} />

				<button className="bg-gray-600 rounded-md select-none px-4 py-2" onClick={() => {
					quantityRef.current!.value = (corposList.length + 1).toString()
					AddCorpos()
				}}>
					Adicionar corpo
				</button>
			</section>

			<section className="divisor">
				<header>
					<h2 className="text-center text-2xl">Contatos</h2>
				</header>

				<Contatos {...{ contatosList }} />

				<div className="flex gap-4">
					<button
						className="bg-gray-600 rounded-md select-none px-4 py-2"
						onClick={() => AdicionarContato()}
					>
						Adicionar contato
					</button>

					<button
						className="block bg-red-600 text-gray-200 aspect-square rounded-md px-3 py-3"
						onClick={() => LimparContatos()}
					>
						<FaTrash title="Limpar contatos" />
					</button>
				</div>
			</section>

			<button className="bg-slate-700 py-2 px-8 rounded-lg select-none" type="submit">Enviar</button>
		</main>
	)
}
