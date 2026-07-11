import { fetcher } from "@/lib/coingecko.actions";
import Image from "next/image";
import Link from "next/link";
import { cn, formatCompactCurrency } from "@/lib/utils";
import DataTable from "@/components/DataTable";
import CoinsPagination from "@/components/CoinsPagination";

const Exchanges = async ({ searchParams }: NextPageProps) => {
	const { page } = await searchParams;

	const currentPage = Number(page) || 1;
	const perPage = 10;

	const [exchanges, btc] = await Promise.all([
		fetcher<ExchangeData[]>("/exchanges", {
			per_page: perPage,
			page: currentPage,
		}),
		fetcher<{ bitcoin: { usd: number } }>("/simple/price", {
			ids: "bitcoin",
			vs_currencies: "usd",
		}),
	]);

	const btcUsd = btc.bitcoin?.usd ?? 0;

	const columns: DataTableColumn<ExchangeData>[] = [
		{
			header: "Rank",
			cellClassName: "rank-cell",
			cell: (exchange) => (
				<>
					#{exchange.trust_score_rank ?? "—"}
					<Link
						href={`/exchanges/${exchange.id}`}
						aria-label={`View ${exchange.name}`}
					/>
				</>
			),
		},
		{
			header: "Exchange",
			cellClassName: "exchange-cell",
			cell: (exchange) => (
				<div className="exchange-info">
					<Image
						src={exchange.image}
						alt={exchange.name}
						width={36}
						height={36}
					/>
					<p>{exchange.name}</p>
				</div>
			),
		},
		{
			header: "Trust Score",
			cellClassName: "trust-cell",
			cell: (exchange) => {
				const score = exchange.trust_score ?? 0;
				const color =
					score >= 8
						? "text-green-500"
						: score >= 5
							? "text-yellow-500"
							: "text-red-500";

				return (
					<span className={cn("trust-badge", color)}>
						{exchange.trust_score ?? "—"}
					</span>
				);
			},
		},
		{
			header: "24h Volume",
			cellClassName: "volume-cell",
			cell: (exchange) =>
				formatCompactCurrency(exchange.trade_volume_24h_btc * btcUsd),
		},
		{
			header: "Country",
			cellClassName: "country-cell",
			cell: (exchange) => exchange.country || "—",
		},
		{
			header: "Established",
			cellClassName: "year-cell",
			cell: (exchange) => exchange.year_established ?? "—",
		},
	];

	const hasMorePages = exchanges.length === perPage;
	const estimatedTotalPages =
		currentPage >= 30 ? Math.ceil(currentPage / 30) * 30 + 30 : 30;

	return (
		<main id="exchanges-page">
			<div className="content">
				<h4>Exchanges</h4>

				<DataTable
					tableClassName="exchanges-table"
					columns={columns}
					data={exchanges}
					rowKey={(exchange) => exchange.id}
				/>

				<CoinsPagination
					currentPage={currentPage}
					totalPages={estimatedTotalPages}
					hasMorePages={hasMorePages}
				/>
			</div>
		</main>
	);
};

export default Exchanges;
