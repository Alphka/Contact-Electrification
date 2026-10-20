import type { KeyboardEvent, ReactNode } from "react"
import { FaTrash } from "react-icons/fa6"
import { twJoin } from "tailwind-merge"
import { useRef } from "react"

export interface IInputListItem {
	id: string
	value: string
}

interface IInputListProps {
	getPlaceholder: (index: number) => string
	getRemoveLabel: (index: number) => string
	getInputLabel: (index: number) => string
	addLabel: string
	getLabel: (index: number) => string
	maxItems?: number
	minItems: number
	onChange: (id: string, value: string) => void
	onRemove: (id: string) => void
	actions?: ReactNode
	pattern: string
	items: readonly IInputListItem[]
	onAdd: () => IInputListItem
	name: string
}

export default function InputList({
	getRemoveLabel,
	getPlaceholder,
	getInputLabel,
	minItems,
	maxItems = Infinity,
	addLabel,
	getLabel,
	onChange,
	onRemove,
	pattern,
	actions,
	items,
	onAdd,
	name
}: IInputListProps){
	const pendingFocusId = useRef<string | null>(null)
	const inputs = useRef(new Map<string, HTMLInputElement>())
	const canRemove = items.length > minItems
	const canAdd = items.length < maxItems

	function registerInput(id: string){
		return (element: HTMLInputElement) => {
			inputs.current.set(id, element)

			if(pendingFocusId.current === id){
				pendingFocusId.current = null
				element.focus()
			}

			return () => {
				inputs.current.delete(id)
			}
		}
	}

	function focusItem(id: string | undefined){
		if(!id) return

		const input = inputs.current.get(id)

		if(input) input.focus()
		else pendingFocusId.current = id
	}

	function add(){
		if(canAdd) focusItem(onAdd().id)
	}

	function remove(index: number){
		const sibling = items.at(index + 1) ?? (index > 0 ? items.at(index - 1) : undefined)

		focusItem(sibling?.id)
		onRemove(items[index].id)
	}

	function handleKeyDown(event: KeyboardEvent<HTMLInputElement>, index: number){
		if(event.key !== "Enter" || event.nativeEvent.isComposing) return

		event.preventDefault()

		if(event.shiftKey){
			if(index > 0) focusItem(items[index - 1].id)
		}else if(index < items.length - 1){
			focusItem(items[index + 1].id)
		}else{
			add()
		}
	}

	return (
		<>
			<ul className="flex flex-col gap-2 px-2 sm:px-4">
				{items.map(({ id, value }, index) => (
					<li className="flex items-center justify-between gap-2" key={id}>
						<label className="flex items-center gap-2">
							<span
								className="w-6 shrink-0 text-right text-lg select-none"
								aria-hidden
							>
								{getLabel(index)}
							</span>

							<input
								type="text"
								name={`${name}-${index}`}
								className={twJoin(
									"block w-52 rounded-md border border-transparent bg-gray-800 px-2 py-1",
									"placeholder:text-gray-400",
									"not-focus:user-valid:border-green-600 not-focus:user-invalid:border-red-600",
									"focus:border-blue-600 focus:placeholder:invisible",
									"max-[300px]:w-full sm:w-60"
								)}
								aria-label={getInputLabel(index)}
								placeholder={getPlaceholder(index)}
								autoComplete="off"
								spellCheck={false}
								pattern={pattern}
								value={value}
								onChange={(event) => onChange(id, event.currentTarget.value)}
								onKeyDown={(event) => handleKeyDown(event, index)}
								required
								ref={registerInput(id)}
							/>
						</label>

						{canRemove && (
							<button
								type="button"
								title={getRemoveLabel(index)}
								className="block aspect-square shrink-0 rounded-md bg-slate-600 p-2 transition-colors hover:bg-slate-700 focus-visible:bg-slate-800"
								aria-label={getRemoveLabel(index)}
								onClick={() => remove(index)}
							>
								<FaTrash aria-hidden />
							</button>
						)}
					</li>
				))}
			</ul>

			<div className="flex flex-wrap justify-center gap-2 md:gap-x-4">
				<button
					type="button"
					className={twJoin(
						"rounded-md bg-gray-600 px-2 py-1 transition-colors select-none",
						"hover:bg-slate-700",
						"focus-visible:bg-slate-800",
						"disabled:cursor-not-allowed disabled:bg-gray-800",
						"md:px-4 md:py-2"
					)}
					onClick={add}
					disabled={!canAdd}
				>
					{addLabel}
				</button>

				{actions}
			</div>
		</>
	)
}
