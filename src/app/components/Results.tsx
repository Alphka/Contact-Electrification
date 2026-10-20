import type { ICalculation } from "@helpers/calculate"
import { useTranslations } from "next-intl"
import Charge from "./Charge"

interface IResultsProps {
	calculation: ICalculation
}

export default function Results({ calculation: { results, total } }: IResultsProps){
	const t = useTranslations()

	return (
		<section
			aria-labelledby="results-title"
			className="flex flex-col gap-2 px-4 pt-4 pb-2 md:px-8"
		>
			<h2 id="results-title" className="text-center text-xl font-semibold md:text-2xl">
				{t("results.title")}
			</h2>

			<ol className="mx-2 flex list-inside list-decimal flex-col gap-1 text-lg">
				{results.map((result, index) => (
					<li key={index}>
						<Charge value={result} />
					</li>
				))}
			</ol>

			<hr className="border-slate-400/60" />

			<p className="flex flex-wrap items-center justify-center gap-2 text-center text-lg">
				<span>
					{t("results.total")}:
				</span>

				<Charge value={total} />
			</p>
		</section>
	)
}
