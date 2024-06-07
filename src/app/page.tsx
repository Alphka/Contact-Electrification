"use client"

import type { AdicionarContato, RemoverContato, ModificarContato, ContatoInfo } from "@components/Contatos"
import type { AdicionarCorpo, RemoverCorpo, ModificarCorpo, CorpoInfo } from "@components/Corpos"
import type { ChangeEventHandler, MouseEventHandler } from "react"
import type { UUID } from "crypto"
import { createRef, useCallback, useEffect, useRef, useState } from "react"
import { Fraction, sum, divide } from "@helpers"
import { twJoin, twMerge } from "tailwind-merge"
import { v4 as uuidv4 } from "uuid"
import { FaTrash } from "react-icons/fa6"
import { toast } from "react-toastify"
import Contatos from "@components/Contatos"
import Results from "@components/Results"
import Corpos from "@components/Corpos"

const alphabet = "abcdefghijklmnopqrstuvwxyz"

function NewContato(){
	return {
		id: uuidv4() as UUID,
		value: [],
		inputRef: createRef()
	} as ContatoInfo
}

function NewCorpo(){
	return {
		id: uuidv4() as UUID,
		value: "",
		inputRef: createRef()
	} as CorpoInfo
}

export type Result = Fraction

export default function Home(){
	const defaultCorpos = 2

	const [corposList, setCorposList] = useState<CorpoInfo[]>(() => Array.from(new Array(defaultCorpos), NewCorpo))
	const [contatosList, setContatosList] = useState<ContatoInfo[]>(() => [NewContato()])
	const [quantityInvalid, setQuantityInvalid] = useState(false)
	const [results, setResults] = useState<Result[]>(() => [])
	const quantityRef = useRef<HTMLInputElement>(null)

	const SetCorposSize = useCallback((size: number) => {
		setCorposList(corposList => corposList.slice(0, size))
	}, [])

	const AdicionarCorpo: AdicionarCorpo = useCallback((quantity = 1) => {
		setCorposList(corposList => {
			if(corposList.length + quantity > alphabet.length) return corposList

			return [
				...corposList,
				...Array.from(new Array(quantity), NewCorpo)
			]
		})
	}, [])

	const RemoverCorpo: RemoverCorpo = useCallback(id => {
		setCorposList(corposList => {
			const index = corposList.findIndex(corpo => corpo.id === id)

			if(index === -1) return corposList

			return [
				...corposList.slice(0, index),
				...corposList.slice(index + 1)
			]
		})
	}, [])

	const ModificarCorpo: ModificarCorpo = useCallback((id, info) => {
		setCorposList(corposList => {
			const index = corposList.findIndex(corpo => corpo.id === id)

			if(index === -1) return corposList

			delete info.fraction

			return [
				...corposList.slice(0, index),
				{ ...corposList[index], ...info },
				...corposList.slice(index + 1)
			]
		})
	}, [])

	const AdicionarContato: AdicionarContato = useCallback(() => {
		setContatosList(contatosList => [
			...contatosList,
			NewContato()
		])
	}, [])

	const RemoverContato: RemoverContato = useCallback(id => {
		setContatosList(contatosList => {
			const index = contatosList.findIndex(e => e.id === id)

			if(index === -1) return contatosList

			return [
				...contatosList.slice(0, index),
				...contatosList.slice(index + 1)
			]
		})
	}, [])

	const ModificarContato: ModificarContato = useCallback((id, info) => {
		setContatosList(contatosList => {
			const index = contatosList.findIndex(contato => contato.id === id)

			if(index === -1) return contatosList

			return [
				...contatosList.slice(0, index),
				{ ...contatosList[index], ...info },
				...contatosList.slice(index + 1)
			]
		})
	}, [])

	const LimparContatos = useCallback(() => {
		setContatosList([NewContato()])
	}, [])

	const handleQuantityChange = useCallback<ChangeEventHandler<HTMLInputElement>>(event => {
		const { currentTarget: input } = event

		event.preventDefault()

		input.value = input.value.trim()

		if(!input.checkValidity()){
			input.reportValidity()
			setQuantityInvalid(true)
			return
		}

		setQuantityInvalid(false)

		const value = Number(input.value)
		const { length: size } = corposList

		if(value < size){
			if(value >= defaultCorpos){
				SetCorposSize(value)
			}
		}else if(value > size){
			AdicionarCorpo(value - size)
		}
	}, [corposList])

	const handleAdicionarCorpo = useCallback(() => AdicionarCorpo(), [AdicionarCorpo])

	const handleSubmit: MouseEventHandler<HTMLButtonElement> = useCallback(event => {
		event.preventDefault()

		try{
			if(quantityInvalid) return "Preencha uma quantidade de corpos válida"
			if(corposList.some(corpo => corpo.error || !corpo.value)) return "Preencha todas as cargas dos corpos corretamente"
			if(contatosList.some(contato => contato.error || !contato.value)) return "Preencha todos os contatos corretamente"

			const corposLetterMap = new Map(corposList.map((corpo, index) => [alphabet[index], corpo]))

			const results: Result[] = []

			for(const { value: corpos } of contatosList){
				const contact: CorpoInfo[] = []

				for(const letter of corpos){
					const corpoInfo = corposLetterMap.get(letter.toLowerCase())

					if(!corpoInfo) throw "Corpo não encontrado: " + letter

					contact.push(corpoInfo)
				}

				const { length: size } = contact

				let chargeSum = 0

				for(const { value, fraction } of contact){
					const decimalValue = fraction ? divide(fraction.numerator, fraction.denominator) * fraction.sign : Number(value.replace(/q/i, ""))
					chargeSum = sum(chargeSum, decimalValue)
				}

				const fraction = new Fraction(chargeSum, size)

				results.push(fraction)

				for(let letter of corpos){
					letter = letter.toLowerCase()
					const info = corposLetterMap.get(letter)!

					corposLetterMap.set(letter, {
						...info,
						value: divide(chargeSum, size).toString(),
						fraction
					})
				}
			}

			setResults(results)
		}catch(error){
			if(typeof error === "string"){
				toast.error(error)
				setResults([])
				return
			}

			toast.error(error instanceof Error ? error.message : String(error))
			console.error(error)
		}
	}, [quantityInvalid, corposList, contatosList])

	useEffect(() => {
		const quantity = quantityRef.current

		if(!quantity) return

		const listener = (event: MouseEvent) => {
			if(document.activeElement === quantity){
				event.stopPropagation()
			}
		}

		quantity.addEventListener("wheel", listener)

		return () => quantity.removeEventListener("wheel", listener)
	}, [quantityRef.current])

	useEffect(() => {
		const quantity = quantityRef.current

		if(!quantity) return

		quantity.value = corposList.length.toString()
	}, [quantityRef.current, corposList])

	return (
		<main className="flex flex-col items-center gap-8 py-8 md:pt-12 lg:pt-16 px-2 sm:px-4">
			<header>
				<h1 className="text-center text-2xl md:text-3xl md:leading-snug lg:text-4xl lg:leading-snug font-bold">
					Eletrização por contato
				</h1>
			</header>

			<section className="divisor flex flex-col items-center gap-4 w-full">
				<header>
					<h2 className="text-center text-xl md:text-2xl font-normal">
						<label id="quantity-label" htmlFor="quantity">Quantidade de corpos</label>
					</h2>
				</header>

				<input
					id="quantity"
					type="number"
					aria-labelledby="quantity-label"
					className={twMerge(
						"appearance-none block bg-gray-700 rounded-md py-1 px-2 w-20 text-center max-w-xl sm:min-w-min transition-colors",
						"border border-solid border-transparent valid:border-green-600 focus:border-blue-600",
						quantityInvalid && "border-red-600"
					)}
					min={2}
					max={26}
					step={1}
					defaultValue={defaultCorpos}
					onChange={handleQuantityChange}
					ref={quantityRef}
					required
				/>
			</section>

			<section className="divisor flex flex-col items-center gap-4 w-full">
				<header>
					<h2 className="text-center text-xl md:text-2xl font-normal" aria-label="Lista de corpos">
						Corpos
					</h2>
				</header>

				<Corpos {...{
					alphabet,
					corposList,
					defaultCorpos,
					AdicionarCorpo,
					ModificarCorpo,
					RemoverCorpo
				}} />

				<button
					type="button"
					className={twJoin(
						"bg-gray-600 px-2 md:px-4 py-1 md:py-2 rounded-md select-none transition-colors",
						"hover:bg-slate-700",
						"focus-visible:bg-slate-800 focus-visible:text-opacity-80",
						"disabled:bg-gray-800 disabled:cursor-not-allowed"
					)}
					aria-label="Adicionar corpo à lista"
					onClick={handleAdicionarCorpo}
					disabled={corposList.length === alphabet.length}
				>
					Adicionar corpo
				</button>
			</section>

			<section className="divisor flex flex-col items-center gap-4 w-full">
				<header>
					<h2 className="text-center text-xl md:text-2xl font-normal" aria-label="Lista de contatos">
						Contatos
					</h2>
				</header>

				<Contatos {...{
					contatosList,
					AdicionarContato,
					ModificarContato,
					RemoverContato
				}} />

				<div className="flex flex-wrap justify-center gap-2 md:gap-x-4">
					<button
						type="button"
						className={twJoin(
							"bg-gray-600 px-2 md:px-4 py-1 md:py-2 rounded-md select-none transition-colors",
							"hover:bg-slate-700",
							"focus-visible:bg-slate-800 focus-visible:text-opacity-80"
						)}
						aria-label="Adicionar contato à lista"
						onClick={AdicionarContato}
					>
						Adicionar contato
					</button>

					<button
						type="button"
						className={twJoin(
							"block bg-red-800 aspect-square p-2 md:p-3 rounded-md transition-colors",
							"hover:opacity-80 hover:shadow-md",
							"focus-visible:bg-red-900 focus-visible:shadow-lg"
						)}
						aria-label="Limpar lista de contatos"
						title="Limpar contatos"
						onClick={LimparContatos}
					>
						<FaTrash />
					</button>
				</div>
			</section>

			<button
				type="submit"
				className={twJoin(
					"bg-slate-700 py-2 px-8 rounded-lg select-none transition-colors",
					"hover:bg-slate-700",
					"focus-visible:bg-slate-800 focus-visible:text-opacity-80"
				)}
				aria-label="Calcular contatos"
				onClick={handleSubmit}
			>
				Calcular
			</button>

			{!!results.length && <Results {...{ results, corposList }} />}
		</main>
	)
}
