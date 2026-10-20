import type { Messages } from "next-intl"

export type InputErrorCode = Exclude<keyof Messages["errors"], "unexpected">

export interface IInputErrorValues {
	body?: string
	contact?: number
}

export interface IInputErrorField {
	type: "body" | "contact"
	index: number
}

export default class InputError extends Error {
	readonly code: InputErrorCode
	readonly field: IInputErrorField
	readonly values: IInputErrorValues

	constructor(code: InputErrorCode, field: IInputErrorField, values: IInputErrorValues){
		super(`${code}: ${JSON.stringify(values)}`)

		this.name = "InputError"
		this.code = code
		this.field = field
		this.values = values
	}
}
