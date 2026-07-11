import { fetcher } from "@/lib/coingecko.actions";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
	cn,
	formatCompactCurrency,
	formatCompactNumber,
	formatCurrency,
	formatPercentage,
} from "@/lib/utils";
import ReadMore from "@/components/ReadMore";

const Page = async ({ params }: NextPageProps) => {
	const { id } = await params;

	const nft = await fetcher<NftDetails>(`/nfts/${id}`);

	const change = nft.floor_price_in_usd_24h_percentage_change;
	const hasChange = change !== null && change !== undefined;
	const isUp = (change ?? 0) >= 0;
	const avatar = nft.image.small_2x || nft.image.small;
	const sym = nft.native_currency_symbol.toUpperCase();

	const stats: { label: string; value: string; sub?: string }[] = [
		{
			label: "Floor Price",
			value: formatCurrency(nft.floor_price.usd),
			sub: `${nft.floor_price.native_currency} ${sym}`,
		},
		{ label: "Market Cap", value: formatCompactCurrency(nft.market_cap.usd) },
		{ label: "24h Volume", value: formatCompactCurrency(nft.volume_24h.usd) },
		{ label: "24h Sales", value: formatCompactNumber(nft.one_day_sales) },
		{
			label: "Owners",
			value: formatCompactNumber(nft.number_of_unique_addresses),
		},
		{ label: "Total Supply", value: formatCompactNumber(nft.total_supply) },
	];

	const links = [
		{ label: "Website", href: nft.links?.homepage },
		{ label: "Twitter", href: nft.links?.twitter },
		{ label: "Discord", href: nft.links?.discord },
	].filter((l): l is { label: string; href: string } => Boolean(l.href));

	const description = nft.description?.replace(/<[^>]*>/g, "").trim();

	return (
		<main id="nft-details-page">
			<div className="nft-hero">
				<div className="nft-hero-banner">
					{nft.banner_image && (
						<Image
							src={nft.banner_image}
							alt=""
							fill
							sizes="100vw"
							className="banner-img"
						/>
					)}
					<div className="banner-overlay" />

					{nft.market_cap_rank && (
						<span className="nft-hero-rank">Rank #{nft.market_cap_rank}</span>
					)}

					<Image
						src={avatar}
						alt={nft.name}
						width={80}
						height={80}
						className="nft-hero-avatar"
					/>
				</div>

				<div className="nft-hero-body">
					<div className="nft-hero-head">
						<div className="nft-hero-title">
							<div className="name-row">
								<h1>{nft.name}</h1>
								{hasChange && (
									<span
										className={cn(
											"floor-change",
											isUp ? "text-green-500" : "text-red-500",
										)}
									>
										{formatPercentage(change)} (24h)
									</span>
								)}
							</div>
							<p className="sub">{nft.symbol}</p>
						</div>

						{links.length > 0 && (
							<div className="nft-links">
								{links.map(({ label, href }) => (
									<Link
										key={label}
										href={href}
										target="_blank"
										rel="noopener noreferrer"
										className="nft-link"
									>
										{label}
										<ArrowUpRight size={14} />
									</Link>
								))}
							</div>
						)}
					</div>

					<ul className="nft-hero-stats">
						{stats.map(({ label, value, sub }) => (
							<li key={label}>
								<p className="label">{label}</p>
								<p className="value">{value}</p>
								{sub && <p className="sub">{sub}</p>}
							</li>
						))}
					</ul>
				</div>
			</div>

			{description && (
				<section className="about-section">
					<div className="about-card">
						<div className="about-head">
							<Image
								src={nft.image.small}
								alt={nft.name}
								width={32}
								height={32}
								className="about-icon"
							/>
							<h4>About {nft.name}</h4>
						</div>

						<ReadMore text={description} />
					</div>
				</section>
			)}
		</main>
	);
};

export default Page;
