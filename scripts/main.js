/// <reference path="../typings/index.d.ts" />

function WaitForBody(){
	if(!document.body) return new Promise(resolve => window.addEventListener("DOMContentLoaded", resolve))
	return Promise.resolve()
}

/** @param {HTMLInputElement} input */
function FocusEnd(input){
	/** @this {typeof input} */
	function MoveCursor(){
		setTimeout(() => {
			this.selectionStart = this.selectionEnd = this.value.length + 1
			this.removeEventListener("focus", MoveCursor)
		}, 0)
	}

	input.addEventListener("focus", MoveCursor)
	input.focus()
}

/** @param {number} number */
function ToFraction(number){
	const string = number.toString()

	const index = string.indexOf(".")
	const before = string.substring(0, index)
	const after = string.substring(index + 1)
	const denominator = "1" + "0".repeat(after.length)

	return `${before + after}/${denominator}`
}

const WaitForMathJS = (() => {
	const script = document.head.querySelector('script[src*="math.js"]')

	if(!script){
		const date = Date.now()

		/** @type {Promise<void>} */
		let promise

		return () => promise ?? (promise = new Promise((resolve, reject) => {
			const interval = setInterval(() => {
				if(window.math){
					clearInterval(interval)
					resolve()
				}else if(Date.now() - date >= 1e4) reject("Clearing interval, mathjs not found")
			}, 10)
		}))
	}

	let _resolve, _reject

	const promise = new Promise((resolve, reject) => {
		script.addEventListener("load", resolve)
		script.addEventListener("error", reject)

		_resolve = resolve
		_reject = reject
	})

	promise.then(() => {
		script.removeEventListener("load", _resolve)
		script.removeEventListener("error", _reject)
	})

	return () => promise
})()

;(() => {
	const alphabet = "abcdefghijklmnopqrstuvwxyz"
	const expRegex = /^-?(?:\d+q?|q)(?:\/\d+){0,2}$/
	const contactRegex = /[^a-z,.]|\.(?!$)/i
	const charges = /** @type {HTMLInputElement[]} */ (new Array)

	/**
	 * @param {string} charge
	 * @returns {[number, string] | false}
	*/
	function ApproveCharge(charge){
		if(!charge || !expRegex.test(charge)) return false

		charge = charge
			.replace(/\bq\b/g, "1")
			.replace("q", "")

		if(charge.includes("/")){
			const params = charge.split("/")

			if(params.length === 3) return Divide(params[0] + "/" + params[1], +params[2])
			else return Divide(+params[0], +params[1])
		}

		return [Number(charge), charge + "/1"]
	}

	/**
	 * @param {string} contact
	 * @param {number} total
	 * @returns `false` if contact is invalid, or else a list of objects
	*/
	function ApproveContact(contact, total){
		contact = contact.replace(/ /g, "")

		if(contactRegex.test(contact)) return false

		const names = charges.map(({ name }) => name)
		const contacts = contact.replace(/\./g, "").toLowerCase().split(",")

		if(contacts.length === 1 || contacts.length > total) return false
		if(contacts.some(object => object.length !== 1 || !names.includes(object))) return false

		return contacts
	}

	function CreateResultsContainer(){
		const container = document.createElement("div")
		const header = document.createElement("header")
		const h3 = document.createElement("h3")
		const ul = document.createElement("ul")

		h3.textContent = "Resultados"

		header.appendChild(h3)
		container.appendChild(header)
		container.appendChild(ul)

		container.id = "results"

		return { container, header, h3, ul }
	}

	/**
	 * @param {string | number} a
	 * @param {number} b
	 * @returns {[number, string]}
	 */
	function Divide(a, b){
		if(b === 0) throw new Error("Denominator cannot be zero")

		if(typeof a === "number"){
			const result = {
				number: a / b,
				string: `${a}/${b}`
			}

			return [result.number, result.string]
		}

		const [top, bottom] = a.substring(0, a.indexOf("/") - 1).split("/").map(Number)
		const division = top / bottom

		const result = {
			number: division,
			string: `${top}/${bottom}`
		}

		if(division % 1 !== 0){
			const denominator = bottom * b
			const division = top / denominator

			result.string = `${top}/${denominator}`
			result.number = division
		}

		result.string = result.string.replace("/", "q$&")

		return [result.number, result.string]
	}

	WaitForBody().then(() => {
		const content = /** @type {HTMLElement} */ (document.querySelector("main > article#content"))
		const quantity = /** @type {HTMLInputElement} */ (content.querySelector("#quantity input"))
		const inputs = /** @type {HTMLUListElement} */ (content.querySelector("#inputs ul"))
		const contacts = /** @type {HTMLDivElement} */ (content.querySelector("#contacts"))
		const contactsUL = /** @type {HTMLUListElement} */ (contacts.querySelector(":scope > ul"))
		const contactsList = contactsUL.getElementsByTagName("li")
		const addContact = /** @type {HTMLInputElement} */ (contacts.querySelector(":scope > input[type=button]"))
		const submit = /** @type {HTMLInputElement} */ (content.querySelector(":scope > input[type=submit]"))
		const { container: results, ul: resultsUL } = CreateResultsContainer()

		/** @param {string} name */
		function CreateInput(name, isLast = false){
			const li = document.createElement("li")
			const label = document.createElement("label")
			const input = document.createElement("input")
			const text = document.createElement("span")

			text.textContent = name.toUpperCase()
			input.type = "text"
			input.name = name

			label.appendChild(text)
			label.appendChild(input)
			li.appendChild(label)

			input.addEventListener("keypress", function(event){
				if(event.key === "Enter"){
					if(event.shiftKey) return

					event.stopPropagation()
					event.preventDefault()

					const namesElements = Array.from(inputs.querySelectorAll(":scope > li > label > span:first-child"))
					const names = namesElements.map(element => element.textContent.toLowerCase())

					if(isLast){
						/** @type {HTMLInputElement | null} */
						const input = contacts.querySelector(":scope > ul > li:first-child > input")
						if(input) FocusEnd(input)
					}else{
						const index = names.indexOf(name)
						const nextName = names[index + 1]
						const nextInput = /** @type {HTMLInputElement} */ (document.querySelector(`input[name="${nextName}"]`))

						if(index === -1) throw new Error("Invalid name")

						FocusEnd(nextInput)
					}
				}
			})

			input.addEventListener("input", function(event){
				const { value } = this

				if(!value) return this.classList.remove("valid", "invalid")

				const approved = ApproveCharge(value)

				this.classList[approved ? "add" : "remove"]("valid")
				this.classList[approved ? "remove" : "add"]("invalid")
			})

			return { li, label, input }
		}

		quantity.addEventListener("wheel", function(event){
			if(document.activeElement === this){
				event.stopPropagation()
				event.preventDefault()
			}
		})

		function ClearCharges(){
			charges.length = 0

			if(inputs.childElementCount){
				inputs.replaceChildren()
			}
		}

		function ClearContacts(){
			contactsUL.replaceChildren()
		}

		function ClearResults(){
			resultsUL.replaceChildren()
			results.remove()

			// In case of duplication
			document.querySelector("#results")?.remove()
		}

		/**
		 * @this {typeof quantity}
		 * @param {Event} [event]
		 */
		function ChangeQuantity(event){
			const value = Number(this.value)

			if(!value) return
			if(value < 0) throw new Error("Quantity cannot be negative")
			if(value === 1) throw new Error("Quantity must be greater than one")
			if(!Number.isFinite(value) || Number.isNaN(value)) throw new Error("Invalid number")
			if(value > alphabet.length) throw new Error("Quantity must be lower than or equal to " + alphabet.length)

			ClearCharges()

			const fragment = document.createDocumentFragment()

			for(let index = 0; index < value; index++){
				const name = alphabet[index]
				const { li, input } = CreateInput(name, index === value - 1)

				charges.push(input)
				fragment.appendChild(li)
			}

			inputs.appendChild(fragment)

			ClearContacts()
			ClearResults()
			AddContact.call(contacts)
		}

		/**
		 * @this {typeof contacts}
		 * @param {MouseEvent} [event]
		*/
		function AddContact(event){
			const item = document.createElement("li")
			const input = document.createElement("input")

			input.type = "text"
			input.className = "contact"

			item.appendChild(input)

			if(contactsList.length === 0){
				input.value = "A, B"
				input.classList.add("valid")

				contactsUL.appendChild(item)
			}else contactsList.item(contactsList.length - 1).after(item)

			/** @this {HTMLInputElement} */
			function RemoveParent(){
				if(document.querySelectorAll("#contacts .contact").length > 1) this.parentElement.remove()
			}

			input.addEventListener("dblclick", RemoveParent)

			input.addEventListener("input", function(event){
				const { value } = this

				if(!value) return input.classList.remove("valid", "invalid")

				const approved = ApproveContact(value, charges.length)

				input.classList[approved ? "add" : "remove"]("valid")
				input.classList[approved ? "remove" : "add"]("invalid")
			})

			input.addEventListener("keydown", function(event){
				const { parentElement: li } = this
				const { parentElement: ul } = li

				if(event.key === "Backspace" || event.key === "Delete"){
					if(!this.value && ul.childElementCount > 1 && li === ul.lastElementChild){
						const nextInput = li.previousElementSibling.querySelector("input")

						RemoveParent.call(this)
						nextInput.focus()

						event.preventDefault()
						event.stopPropagation()
						event.stopImmediatePropagation()
					}
				}
			})

			input.addEventListener("keypress", function(event){
				if(event.key === "Enter"){
					const { parentElement: li } = this
					const parent = li.parentElement
					const children = parent.childNodes

					if(li === children.item(children.length - 1)){
						AddContact()
						contactsList.item(contactsList.length - 1).querySelector("input").focus()
					}else li.nextElementSibling.querySelector("input").focus()

					event.preventDefault()
					event.stopPropagation()
				}
			})

			if(event?.isTrusted) input.focus()
		}

		/**
		 * @param {[number, string]} result
		 * @param {number} position
		 */
		function AddResult(result, position){
			const li = document.createElement("li")
			const fraction = result[0] % 1 === 0 ? result[0] + "q" : result[1].replace("/", "q$&")

			li.textContent = `${position}º contato: ${fraction}`

			resultsUL.appendChild(li)
		}

		/**
		 * @this {typeof submit}
		 * @param {MouseEvent} event
		 */
		function Submit(event){
			const { math } = window
			const contacts = Array.from(contactsList).map(li => li.querySelector("input"))

			ClearResults()

			try{
				const chargesMap = /** @type {Map<string, [number, string]>} */ (new Map)
				const contactsArray = /** @type {string[][]} */ (new Array)
				const contactsResults = /** @type {[number, string][]} */ (new Array)

				charges.forEach(({ name, value }) => {
					const approved = ApproveCharge(value)

					if(approved) chargesMap.set(name, approved)
					else throw new Error(value ? `Invalid charge: ${name.toUpperCase()}(${value})` : `Empty charge (${name.toUpperCase()})`)
				})

				contacts.forEach(({ value }, index) => {
					const approved = ApproveContact(value, charges.length)

					if(approved) contactsArray.push(approved)
					else throw new Error(value ? `Invalid contact: ${value}` : `Empty contact (${index + 1})`)
				})

				for(const contact of contactsArray){
					const { length } = contact
					const charges = contact.map(object => chargesMap.get(object))
					const sum = math.add(...charges.map(([number]) => number))

					let result = sum / length
					let fraction = `${sum}/${length}`

					if(result % 1 !== 0){
						let object

						if(sum % 1 === 0){
							object = /** @type {import("../typings/mathjs").Fraction} */ (math.fraction(sum, length))
						}else{
							const string = sum.toString()
							const dotIndex = string.indexOf(".")

							if(string.substring(dotIndex + 1).length >= 15){
								const fractions = charges.map(([number, string]) => /** @type {import("../typings/mathjs").Fraction} */ (math.fraction(string)))
								const sum = math.add(...fractions)
								const division = /** @type {import("../typings/mathjs").Fraction} */ (math.divide(sum, length))

								object = division

								if(object.d === 1) result = object.n
							}else{
								const [top, bottom] = ToFraction(sum).split("/").map(Number)
								object = /** @type {import("../typings/mathjs").Fraction} */ (math.fraction(top, bottom * length))
							}
						}

						fraction = `${object.n}/${object.d}`
					}

					for(const object of contact) chargesMap.set(object, [result, fraction])

					contactsResults.push([result, fraction])
				}

				const li = document.createElement("li")
				const resultsStrings = Array.from(chargesMap.values()).map(([number, string]) => string)
				const resultsFractions = resultsStrings.map(fraction => /** @type {import("../typings/mathjs").Fraction} */ (math.fraction(fraction)))
				const resultsSum = math.add(...resultsFractions)

				const resultString = (() => {
					const { n, d } = resultsSum
					return d === 1 ? n + "q" : `${n}q/${d}`
				})()

				li.textContent = "Soma das energias: " + resultString
				li.style.textAlign = "center"

				contactsResults.forEach((contact, index) => AddResult(contact, index + 1))

				resultsUL.appendChild(li)
				content.appendChild(results)
			}catch(error){
				console.error(error)
			}
		}

		quantity.addEventListener("keypress", function(event){
			if(event.key === "Enter") setTimeout(() => charges[0].focus(), 0)
		})

		quantity.addEventListener("input", ChangeQuantity)
		addContact.addEventListener("click", AddContact)

		WaitForMathJS().then(() => submit.addEventListener("click", Submit))

		ChangeQuantity.call(quantity)
	})
})()
