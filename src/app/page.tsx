"use client"

import type { AdicionarContato, RemoverContato, ModificarContato, ContatoInfo } from "@controllers/Contatos"
import type { AdicionarCorpo, RemoverCorpo, ModificarCorpo, CorpoInfo } from "@controllers/Corpos"
import type { UUID } from "crypto"
import { useCallback, useEffect, useRef, useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { FaTrash } from "react-icons/fa6"
import { twMerge } from "tailwind-merge"
import { toast } from "react-toastify"
import Contatos from "@controllers/Contatos"
import Fraction from "@helpers/Fraction"
import Corpos from "@controllers/Corpos"

const alphabet = "abcdefghijklmnopqrstuvwxyz"

function NewContato(){
	return {
		id: uuidv4() as UUID,
		value: []
	} as ContatoInfo
}

function NewCorpo(){
	return {
		id: uuidv4() as UUID,
		value: ""
	} as CorpoInfo
}

type Result = Fraction

export default function Home(){
	const defaultCorpos = 2

	const [corposList, setCorposList] = useState<CorpoInfo[]>(Array.from(new Array(defaultCorpos), () => NewCorpo()))
	const [contatosList, setContatosList] = useState<ContatoInfo[]>([NewContato()])
	const [quantityInvalid, setQuantityInvalid] = useState(false)
	const [results, setResults] = useState<Result[]>([])
	const quantityRef = useRef<HTMLInputElement>(null)
	const quantity = quantityRef.current

	const SetCorposSize = useCallback((size: number) => {
		setCorposList(corposList => corposList.slice(0, size))
	}, [])

	const AdicionarCorpo: AdicionarCorpo = useCallback((quantity = 1) => {
		setCorposList(corposList => [
			...corposList,
			...Array.from(new Array(quantity), () => NewCorpo())
		])
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

	const handleQuantityChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>(event => {
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
					type="number"
					id="quantity"
					aria-labelledby="quantity-label"
					className={twMerge(
						"appearance-none block bg-gray-700 rounded-md py-1 px-2 w-20 text-center max-w-xl sm:min-w-min",
						"border border-solid border-transparent",
						quantityInvalid && "border-red-700"
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
					RemoverCorpo,
					ModificarCorpo
				}} />

				<button
					className="bg-gray-600 rounded-md select-none px-2 md:px-4 py-1 md:py-2"
					aria-label="Adicionar corpo à lista"
					onClick={() => AdicionarCorpo()}
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
					RemoverContato,
					ModificarContato
				}} />

				<div className="flex flex-wrap justify-center gap-2 md:gap-x-4">
					<button
						className="bg-gray-600 rounded-md select-none px-2 md:px-4 py-1 md:py-2"
						aria-label="Adicionar contato à lista"
						onClick={() => AdicionarContato()}
					>
						Adicionar contato
					</button>

					<button
						className="block bg-red-800 aspect-square rounded-md p-2 md:p-3"
						aria-label="Limpar lista de contatos"
						title="Limpar contatos"
						onClick={LimparContatos}
					>
						<FaTrash aria-label="Ícone de lixeira" role="img" />
					</button>
				</div>
			</section>

			<button
				className="bg-slate-700 py-2 px-8 rounded-lg select-none"
				aria-label="Calcular contatos"
				type="submit"
				onClick={event => {
					event.preventDefault()

					const showError = (message: string) => {
						toast.error(message)
						setResults([])
					}

					if(quantityInvalid) return showError("Preencha uma quantidade de corpos válida")
					if(corposList.some(corpo => corpo.error || !corpo.value)) return showError("Preencha todas as cargas dos corpos corretamente")
					if(contatosList.some(contato => contato.error || !contato.value)) return showError("Preencha todos os contatos corretamente")

					const corposLetterMap = new Map(corposList.map((corpo, index) => ([
						alphabet[index],
						corpo
					])))

					const results: Result[] = []

					for(const { value: corpos } of contatosList){
						const contact: CorpoInfo[] = []

						for(const corpo of corpos){
							contact.push(corposLetterMap.get(corpo.toLowerCase())!)
						}

						const { length: size } = contact

						let sum = 0

						for(const { value, fraction } of contact){
							sum += fraction ? fraction.numerator / fraction.denominator : Number(value.replace(/[qQ]/, ""))
						}

						const fraction = new Fraction(sum, size)

						results.push(fraction)

						for(const corpo of corpos){
							const letter = corpo.toLowerCase()
							const info = corposLetterMap.get(letter)!

							corposLetterMap.set(letter, {
								...info,
								value: (sum / size).toString(),
								fraction
							})
						}
					}

					setResults(results)
				}}
			>
				Calcular
			</button>

			{Boolean(results.length) && (
				<div className="flex flex-col pb-2 pt-4 px-4 md:px-8 gap-2">
					<h2 className="text-center text-xl md:text-2xl font-semibold">Resultados</h2>

					<table className="mx-2">
						<colgroup>
							<col className="w-6" />
							<col className="w-auto" />
						</colgroup>
						<tbody>
							{results.map((fraction, index) => {
								const position = index + 1

								return (
									<tr aria-label={`Resultado do contato ${position}`} key={`result-${index}`}>
										<td>{position}.</td>
										<td>{fraction.toString()}</td>
									</tr>
								)
							})}
						</tbody>
					</table>

					<hr className="border-slate-400 border-opacity-60" />

					<div className="flex items-center justify-center flex-wrap gap-2 text-center">
						<h3 className="font-normal text-lg">Soma das cargas:</h3>
						<p>{corposList.map(({ value }) => Number(value)).reduce((a, b) => a + b, 0)}q</p>
					</div>
				</div>
			)}
		</main>
	)
}
