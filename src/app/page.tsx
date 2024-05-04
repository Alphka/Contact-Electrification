"use client"

import type { UUID } from "crypto"
import { useCallback, useEffect, useRef, useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { FaTrash } from "react-icons/fa6"
import { twJoin } from "tailwind-merge"
import Contatos, { type ContatoInfo } from "../controllers/Contatos"
import Corpos, { type CorpoInfo } from "../controllers/Corpos"

function NewContato(){
	return {
		id: uuidv4() as UUID,
		contato: []
	} as ContatoInfo
}

function NewCorpo(){
	return {
		id: uuidv4() as UUID
	} as CorpoInfo
}

export default function Home(){
	const defaultCorpos = 2

	const [corposList, setCorposList] = useState<CorpoInfo[]>(Array.from(new Array(defaultCorpos), () => NewCorpo()))
	const [contatosList, setContatosList] = useState<ContatoInfo[]>([NewContato()])
	const [quantityInvalid, setQuantityInvalid] = useState(false)
	const quantityRef = useRef<HTMLInputElement>(null)
	const quantity = quantityRef.current

	const SetCorposSize = useCallback((size: number) => {
		setCorposList(corposList => corposList.slice(0, size))
	}, [])

	const AdicionarCorpo = useCallback((quantity: number = 1) => {
		setCorposList(corposList => [
			...corposList,
			...Array.from(new Array(quantity), () => NewCorpo())
		])
	}, [])

	const RemoverCorpo = useCallback((id: CorpoInfo["id"]) => {
		setCorposList(corposList => {
			const index = corposList.findIndex(corpo => corpo.id === id)

			if(index === -1) return corposList

			return [
				...corposList.slice(0, index),
				...corposList.slice(index + 1)
			]
		})
	}, [])

	const ModificarCorpo = useCallback((id: CorpoInfo["id"], value: CorpoInfo["value"]) => {
		setCorposList(corposList => {
			const index = corposList.findIndex(corpo => corpo.id === id)

			if(index === -1) return corposList

			return [
				...corposList.slice(0, index),
				{ ...corposList[index], value },
				...corposList.slice(index + 1)
			]
		})
	}, [])

	const AdicionarContato = useCallback(() => {
		setContatosList(contatosList => [
			...contatosList,
			NewContato()
		])
	}, [])

	const RemoverContato = useCallback((id: ContatoInfo["id"]) => {
		setContatosList(contatosList => {
			const index = contatosList.findIndex(e => e.id === id)

			if(index !== -1) return contatosList

			return [
				...contatosList.slice(0, index),
				...contatosList.slice(index + 1)
			]
		})
	}, [])

	const ModificarContato = useCallback((id: ContatoInfo["id"], contato: ContatoInfo["contato"]) => {
		setContatosList(contatosList => {
			const index = contatosList.findIndex(contato => contato.id === id)

			if(index === -1) return contatosList

			return [
				...contatosList.slice(0, index),
				{ ...contatosList[index], contato },
				...contatosList.slice(index + 1)
			]
		})
	}, [])

	const LimparContatos = useCallback(() => {
		setContatosList([NewContato()])
	}, [])

	const UpdateQuantity = useCallback((value: number) => {
		const { length: size } = corposList

		if(value < size){
			if(value >= defaultCorpos){
				SetCorposSize(value)
			}
		}else if(value > size){
			AdicionarCorpo(value - size)
		}
	}, [corposList, SetCorposSize, AdicionarCorpo])

	const handleQuantityChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>(event => {
		const { currentTarget: input } = event

		event.preventDefault()
		event.nativeEvent.stopImmediatePropagation()

		input.value = input.value.trim()

		if(!input.checkValidity()){
			input.reportValidity()
			setQuantityInvalid(true)
			return
		}

		setQuantityInvalid(false)

		UpdateQuantity(Number(input.value))
	}, [UpdateQuantity])

	const handleAdicionarCorpo = useCallback(() => {
		if(!quantity) return

		UpdateQuantity(corposList.length + 1)
	}, [quantity, corposList, UpdateQuantity])

	useEffect(() => {
		if(!quantity) return

		const listener = (event: MouseEvent) => {
			if(document.activeElement === quantity){
				event.stopPropagation()
			}
		}

		quantity.addEventListener("wheel", listener)

		return () => quantity.removeEventListener("wheel", listener)
	}, [quantity])

	useEffect(() => {
		if(!quantity) return

		quantity.value = corposList.length.toString()
	}, [quantity, corposList])

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
					className={twJoin(
						"block bg-gray-700 rounded-md py-1 px-2 w-12 text-center max-w-xl sm:min-w-min",
						quantityInvalid && "invalid"
					)}
					defaultValue={defaultCorpos}
					min={2}
					max={26}
					step={1}
					onChange={handleQuantityChange}
					ref={quantityRef}
					required
				/>
			</section>

			<section className="divisor">
				<header>
					<h2 className="text-center text-2xl">Corpos</h2>
				</header>

				<Corpos {...{
					corposList,
					defaultCorpos,
					AdicionarCorpo,
					RemoverCorpo,
					ModificarCorpo
				}} />

				<button
					className="bg-gray-600 rounded-md select-none px-4 py-2"
					onClick={handleAdicionarCorpo}
				>
					Adicionar corpo
				</button>
			</section>

			<section className="divisor">
				<header>
					<h2 className="text-center text-2xl">Contatos</h2>
				</header>

				<Contatos {...{
					contatosList,
					RemoverContato,
					ModificarContato
				}} />

				<div className="flex gap-4">
					<button
						className="bg-gray-600 rounded-md select-none px-4 py-2"
						onClick={() => AdicionarContato()}
					>
						Adicionar contato
					</button>

					<button
						className="block bg-red-600 text-gray-200 aspect-square rounded-md p-3"
						onClick={() => LimparContatos()}
					>
						<FaTrash title="Limpar contatos" />
					</button>
				</div>
			</section>

			<button className="bg-slate-700 py-2 px-8 rounded-lg select-none" type="submit">
				Calcular
			</button>
		</main>
	)
}
