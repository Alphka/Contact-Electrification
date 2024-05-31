import type { CorpoInfo } from "@controllers/Corpos"
import type { Result } from "@app/page"
import { deepEqualArray } from "@helpers"
import { memo } from "react"

interface ResultsProps {
	results: Result[]
	corposList: CorpoInfo[]
}

const Results = memo(function Results({ results, corposList }: ResultsProps){
	return (
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
	)
}, (prevProps, nextProps) => deepEqualArray(prevProps.results, nextProps.results))

export default Results
