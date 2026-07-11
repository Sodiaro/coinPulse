import { fetcher } from "@/lib/coingecko.actions";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
	cn,
	formatCompactCurrency,
	formatCompactNumber,
	formatCurrency,
} from "@/lib/utils";
import DataTable from "@/components/DataTable";
import ReadMore from "@/components/ReadMore";

const Page = async ({ params }: NextPageProps) => {
	const { id } = await params;

	const [exchange, btc] = await Promise.all([
		fetcher<ExchangeDetails>(`/exchanges/${id}`),
		fetcher<{ bitcoin: { usd: number } }>("/simple/price", {
			ids: "bitcoin",
			vs_currencies: "usd",
		}),
	]);

	const btcUsd = btc.bitcoin?.usd ?? 0;
	const volumeUsd = exchange.trade_volume_24h_btc * btcUsd;
	const score = exchange.trust_score ?? 0;
	const scoreColor =
		score >= 8
			? "text-green-500"
			: score >= 5
				? "text-yellow-500"
				: "text-red-500";

	const stats: { label: string; value: string | number }[] = [
		{ label: "24h Volume", value: formatCompactCurrency(volumeUsd) },
		{
			label: "Trust Rank",
			value: exchange.trust_score_rank ? `#${exchange.trust_score_rank}` : "—",
		},
		{ label: "Coins", value: formatCompactNumber(exchange.coins) },
		{ label: "Pairs", value: formatCompactNumber(exchange.pairs) },
		{ label: "Established", value: exchange.year_established ?? "—" },
		{ label: "Type", value: exchange.centralized ? "Centralized" : "DEX" },
	];

	const links = [
		{ label: "Website", href: exchange.url },
		{
			label: "Twitter",
			href: exchange.twitter_handle
				? `https://twitter.com/${exchange.twitter_handle}`
				: "",
		},
		{ label: "Reddit", href: exchange.reddit_url },
		{ label: "Facebook", href: exchange.facebook_url },
		{ label: "Telegram", href: exchange.telegram_url },
	].filter((l): l is { label: string; href: string } => Boolean(l.href));

	const topPairs = [...exchange.tickers]
		.sort(
			(a, b) => (b.converted_volume?.usd ?? 0) - (a.converted_volume?.usd ?? 0),
		)
		.slice(0, 15);

	const pairColumns: DataTableColumn<ExchangeTicker>[] = [
		{
			header: "Pair",
			cellClassName: "pair-cell",
			cell: (t) => (
				<>
					{t.base}/{t.target}
					{t.trade_url && (
						<a
							href={t.trade_url}
							target="_blank"
							rel="noopener noreferrer"
							aria-label={`Trade ${t.base}/${t.target}`}
						/>
					)}
				</>
			),
		},
		{
			header: "Price",
			cellClassName: "price-cell",
			cell: (t) => formatCurrency(t.converted_last.usd),
		},
		{
			header: "24h Volume",
			cellClassName: "vol-cell",
			cell: (t) => formatCompactCurrency(t.converted_volume.usd),
		},
		{
			header: "Spread",
			cellClassName: "spread-cell",
			cell: (t) => `${(t.bid_ask_spread_percentage ?? 0).toFixed(2)}%`,
		},
	];

	const description = exchange.description?.replace(/<[^>]*>/g, "").trim();

	return (
		<main id="exchange-details-page">
			<div className="ex-hero">
				<div className="ex-head">
					<Image
						src={exchange.image}
						alt={exchange.name}
						width={72}
						height={72}
						className="ex-logo"
					/>

					<div className="ex-title">
						<div className="ex-name-row">
							<h1>{exchange.name}</h1>
							{exchange.trust_score != null && (
								<span className={cn("trust-badge", scoreColor)}>
									Trust {exchange.trust_score}/10
								</span>
							)}
						</div>
						<p className="ex-sub">
							{[
								exchange.country,
								exchange.year_established &&
									`Est. ${exchange.year_established}`,
							]
								.filter(Boolean)
								.join(" · ")}
						</p>
					</div>

					{links.length > 0 && (
						<div className="ex-links">
							{links.map(({ label, href }) => (
								<Link
									key={label}
									href={href}
									target="_blank"
									rel="noopener noreferrer"
									className="ex-link"
								>
									{label}
									<ArrowUpRight size={14} />
								</Link>
							))}
						</div>
					)}
				</div>

				<ul className="ex-stats">
					{stats.map(({ label, value }) => (
						<li key={label}>
							<p className="label">{label}</p>
							<p className="value">{value}</p>
						</li>
					))}
				</ul>
			</div>

			{description && (
				<section className="about-section">
					<div className="about-card">
						<div className="about-head">
							<Image
								src={exchange.image}
								alt={exchange.name}
								width={32}
								height={32}
								className="about-icon"
							/>
							<h4>About {exchange.name}</h4>
						</div>

						<ReadMore text={description} />
					</div>
				</section>
			)}

			<section className="ex-pairs">
				<h4>Top Trading Pairs</h4>

				<DataTable
					tableClassName="pairs-table"
					columns={pairColumns}
					data={topPairs}
					rowKey={(t, i) => `${t.base}-${t.target}-${i}`}
				/>
			</section>
		</main>
	);
};

export default Page;
