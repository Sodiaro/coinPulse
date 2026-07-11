import React from "react";
import { fetcher, getPools } from "@/lib/coingecko.actions";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import ReadMore from "@/components/ReadMore";
import {
	cn,
	formatCompactCurrency,
	formatCompactNumber,
	formatCurrency,
	formatDate,
	formatPercentage,
} from "@/lib/utils";
import LiveDataWrapper from "@/components/LiveDataWrapper";
import Converter from "@/components/Converter";

const Page = async ({ params }: NextPageProps) => {
	const { id } = await params;

	const [coinData, coinOHLCData] = await Promise.all([
		fetcher<CoinDetailsData>(`/coins/${id}`, {
			dex_pair_format: "contract_address",
		}),
		fetcher<OHLCData[]>(`/coins/${id}/ohlc`, {
			vs_currency: "usd",
			days: 1,
			precision: "full",
		}),
	]);

	const platform = coinData.asset_platform_id
		? coinData.detail_platforms?.[coinData.asset_platform_id]
		: null;
	const network = platform?.geckoterminal_url.split("/")[3] || null;
	const contractAddress = platform?.contract_address || null;

	const pool = await getPools(id, network, contractAddress);

	const coinDetails = [
		{
			label: "Market Cap",
			value: formatCurrency(coinData.market_data.market_cap.usd),
		},
		{
			label: "Market Cap Rank",
			value: `# ${coinData.market_cap_rank}`,
		},
		{
			label: "Total Volume",
			value: formatCurrency(coinData.market_data.total_volume.usd),
		},
		{
			label: "Website",
			value: "-",
			link: coinData.links.homepage[0],
			linkText: "Homepage",
		},
		{
			label: "Explorer",
			value: "-",
			link: coinData.links.blockchain_site[0],
			linkText: "Explorer",
		},
		{
			label: "Community",
			value: "-",
			link: coinData.links.subreddit_url,
			linkText: "Community",
		},
	];

	const md = coinData.market_data;
	const symbol = coinData.symbol.toUpperCase();

	const marketStats: {
		label: string;
		value: string;
		change?: number;
		sub?: string;
	}[] = [
		{ label: "24h High", value: formatCurrency(md.high_24h.usd) },
		{ label: "24h Low", value: formatCurrency(md.low_24h.usd) },
		{
			label: "All-Time High",
			value: formatCurrency(md.ath.usd),
			change: md.ath_change_percentage.usd,
			sub: formatDate(md.ath_date.usd),
		},
		{
			label: "All-Time Low",
			value: formatCurrency(md.atl.usd),
			change: md.atl_change_percentage.usd,
			sub: formatDate(md.atl_date.usd),
		},
		{
			label: "Fully Diluted Val.",
			value: md.fully_diluted_valuation.usd
				? formatCompactCurrency(md.fully_diluted_valuation.usd)
				: "—",
		},
		{
			label: "Circulating Supply",
			value: `${formatCompactNumber(md.circulating_supply)} ${symbol}`,
		},
		{
			label: "Total Supply",
			value:
				md.total_supply != null
					? `${formatCompactNumber(md.total_supply)} ${symbol}`
					: "—",
		},
		{
			label: "Max Supply",
			value:
				md.max_supply != null
					? `${formatCompactNumber(md.max_supply)} ${symbol}`
					: "∞",
		},
	];

	const description = coinData.description?.en?.replace(/<[^>]*>/g, "").trim();

	return (
		<main id="coin-details-page">
			<section className="primary">
				<LiveDataWrapper
					coinId={id}
					poolId={pool.id}
					coin={coinData}
					coinOHLCData={coinOHLCData}
				>
					<h4>Exchange Listings</h4>
				</LiveDataWrapper>
			</section>

			<section className="secondary">
				<Converter
					symbol={coinData.symbol}
					icon={coinData.image.small}
					priceList={coinData.market_data.current_price}
				/>

				<div className="details">
					<h4>Coin Details</h4>

					<ul className="details-grid">
						{coinDetails.map(({ label, value, link, linkText }, index) => (
							<li key={index}>
								<p className={label}>{label}</p>

								{link ? (
									<div className="link">
										<Link href={link} target="_blank">
											{linkText || label}
										</Link>
										<ArrowUpRight size={16} />
									</div>
								) : (
									<p className="text-base font-medium">{value}</p>
								)}
							</li>
						))}
					</ul>
				</div>
			</section>

			<section className="market-stats-section">
				<h4>Market Stats</h4>

				<ul className="coin-stats-grid">
					{marketStats.map(({ label, value, change, sub }) => (
						<li key={label}>
							<p className="label">{label}</p>
							<p className="value">{value}</p>

							{(change !== undefined || sub) && (
								<p className="sub">
									{change !== undefined && (
										<span
											className={cn(
												change >= 0 ? "text-green-500" : "text-red-500",
											)}
										>
											{formatPercentage(change)}
										</span>
									)}
									{sub && <span className="date">{sub}</span>}
								</p>
							)}
						</li>
					))}
				</ul>
			</section>

			{description && (
				<section className="about-section">
					<div className="about-card">
						<div className="about-head">
							<Image
								src={coinData.image.small}
								alt={coinData.name}
								width={32}
								height={32}
								className="about-icon"
							/>
							<h4>About {coinData.name}</h4>
						</div>

						<ReadMore text={description} />
					</div>
				</section>
			)}
		</main>
	);
};
export default Page;
