"use client"

import type { ChangeEvent, KeyboardEvent, SubmitEvent } from "react"
import type { IInputErrorValues } from "@entities/InputError"
import type { IInputListItem } from "./InputList"
import type { ICalculation } from "@helpers/calculate"
import { ALPHABET, MAX_BODIES, MIN_BODIES, MIN_CONTACTS, QUANTITY_COMMIT_DELAY } from "@app/constants"
import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { CONTACT_REGEX } from "@helpers/parseContact"
import { CHARGE_REGEX } from "@helpers/parseCharge"
import { FaTrash } from "react-icons/fa6"
import { twJoin } from "tailwind-merge"
import { toast } from "react-toastify"
import InputError from "@entities/InputError"
import calculate from "@helpers/calculate"
import InputList from "./InputList"
import Results from "./Results"

let lastItemId = 0

function createItem(): IInputListItem{
	lastItemId += 1

	return {
		id: `item-${lastItemId}`,
		value: ""
	}
}

function createInitialItems(prefix: string, length: number): IInputListItem[]{
	return Array.from({ length }, (_, index) => ({
		id: `${prefix}-${index}`,
		value: ""
	}))
}

function updateItem(items: IInputListItem[], id: string, value: string){
	return items.map((item) => item.id === id ? {
		...item,
		value
	} : item)
}

function removeItem(items: IInputListItem[], id: string){
	return items.filter((item) => item.id !== id)
}

function parseQuantity(value: string){
	const quantity = Number(value)

	return value !== "" && Number.isInteger(quantity) && quantity >= MIN_BODIES && quantity <= MAX_BODIES ? quantity : null
}

function resizeItems(items: IInputListItem[], length: number){
	if(length <= items.length) return items.slice(0, length)

	return [
		...items,
		...Array.from({ length: length - items.length }, createItem)
	]
}

export default function Calculator(){
	const [quantityDraft, setQuantityDraft] = useState<string | null>(null)
	const [calculation, setCalculation] = useState<ICalculation | null>(null)
	const [contacts, setContacts] = useState(() => createInitialItems("contact", MIN_CONTACTS))
	const [bodies, setBodies] = useState(() => createInitialItems("body", MIN_BODIES))
	const t = useTranslations()

	useEffect(() => {
		if(quantityDraft === null) return

		const quantity = parseQuantity(quantityDraft)

		if(quantity === null) return

		const timeout = setTimeout(() => {
			setBodies((items) => resizeItems(items, quantity))
			setQuantityDraft(null)
		}, QUANTITY_COMMIT_DELAY)

		return () => clearTimeout(timeout)
	}, [quantityDraft])

	function handleQuantityChange(event: ChangeEvent<HTMLInputElement>){
		const { value } = event.currentTarget
		const quantity = parseQuantity(value)

		setQuantityDraft(value)

		if(quantity !== null && quantity > bodies.length) setBodies((items) => resizeItems(items, quantity))
	}

	function commitQuantity(value: string){
		const quantity = parseQuantity(value)

		if(quantity !== null) setBodies((items) => resizeItems(items, quantity))

		setQuantityDraft(null)
	}

	function handleQuantityKeyDown(event: KeyboardEvent<HTMLInputElement>){
		if(event.key !== "Enter") return

		event.preventDefault()
		commitQuantity(event.currentTarget.value)
	}

	function addBody(){
		const item = createItem()

		setBodies((items) => items.length < MAX_BODIES ? [...items, item] : items)

		return item
	}

	function addContact(){
		const item = createItem()

		setContacts((items) => [...items, item])

		return item
	}

	function handleSubmit(event: SubmitEvent<HTMLFormElement>){
		event.preventDefault()

		const form = event.currentTarget

		try{
			setCalculation(calculate(
				bodies.map(({ value }) => value),
				contacts.map(({ value }) => value)
			))
		}catch(error){
			setCalculation(null)

			if(!(error instanceof InputError)){
				toast.error(t("errors.unexpected"))
				throw error
			}

			toast.error(t(`errors.${error.code}`, error.values as Required<IInputErrorValues>))

			const input = form.elements.namedItem(`${error.field.type}-${error.field.index}`)

			if(input instanceof HTMLInputElement) input.focus()
		}
	}

	return (
		<form
			className="flex w-full flex-col items-center gap-8"
			onSubmit={handleSubmit}
			noValidate
		>
			<section className="divisor flex w-full flex-col items-center gap-4">
				<h2 className="text-center text-xl md:text-2xl">
					<label htmlFor="quantity">
						{t("calculator.quantity")}
					</label>
				</h2>

				<input
					id="quantity"
					type="number"
					inputMode="numeric"
					className={twJoin(
						"block w-20 rounded-md border border-transparent bg-gray-700 px-2 py-1 text-center transition-colors",
						"not-focus:user-invalid:border-red-600",
						"focus:border-blue-600"
					)}
					min={MIN_BODIES}
					max={MAX_BODIES}
					step={1}
					value={quantityDraft ?? bodies.length}
					onChange={handleQuantityChange}
					onKeyDown={handleQuantityKeyDown}
					onBlur={(event) => commitQuantity(event.currentTarget.value)}
					required
				/>
			</section>

			<section
				aria-labelledby="bodies-title"
				className="divisor flex w-full flex-col items-center gap-4"
			>
				<h2 id="bodies-title" className="text-center text-xl md:text-2xl">
					{t("calculator.bodies")}
				</h2>

				<InputList
					items={bodies}
					name="body"
					pattern={CHARGE_REGEX.source}
					minItems={MIN_BODIES}
					maxItems={MAX_BODIES}
					addLabel={t("calculator.addBody")}
					getLabel={(index) => ALPHABET[index]}
					getInputLabel={(index) => t("calculator.bodyCharge", { body: ALPHABET[index] })}
					getRemoveLabel={(index) => t("calculator.removeBody", { body: ALPHABET[index] })}
					getPlaceholder={(index) => t("calculator.bodyCharge", { body: ALPHABET[index] })}
					onAdd={addBody}
					onChange={(id, value) => setBodies((items) => updateItem(items, id, value))}
					onRemove={(id) => setBodies((items) => removeItem(items, id))}
				/>
			</section>

			<section
				aria-labelledby="contacts-title"
				className="divisor flex w-full flex-col items-center gap-4"
			>
				<h2 id="contacts-title" className="text-center text-xl md:text-2xl">
					{t("calculator.contacts")}
				</h2>

				<InputList
					items={contacts}
					name="contact"
					pattern={CONTACT_REGEX.source}
					minItems={MIN_CONTACTS}
					addLabel={t("calculator.addContact")}
					getLabel={(index) => `${index + 1}.`}
					getInputLabel={(index) => t("calculator.contact", { position: index + 1 })}
					getRemoveLabel={(index) => t("calculator.removeContact", { position: index + 1 })}
					getPlaceholder={() => t("calculator.contactPlaceholder")}
					onAdd={addContact}
					onChange={(id, value) => setContacts((items) => updateItem(items, id, value))}
					onRemove={(id) => setContacts((items) => removeItem(items, id))}
					actions={(
						<button
							type="button"
							title={t("calculator.clearContacts")}
							className={twJoin(
								"block aspect-square rounded-md bg-red-800 p-2 transition-colors",
								"hover:opacity-80 focus-visible:bg-red-900 md:p-3"
							)}
							aria-label={t("calculator.clearContacts")}
							onClick={() => setContacts([createItem()])}
						>
							<FaTrash aria-hidden />
						</button>
					)}
				/>
			</section>

			<button
				type="submit"
				className={twJoin(
					"rounded-lg bg-slate-700 px-8 py-2 transition-colors select-none",
					"hover:bg-slate-600 focus-visible:bg-slate-800"
				)}
			>
				{t("calculator.calculate")}
			</button>

			<div aria-live="polite">
				{calculation && <Results calculation={calculation} />}
			</div>
		</form>
	)
}
