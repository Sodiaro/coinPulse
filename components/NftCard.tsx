import Image from "next/image";
import Link from "next/link";
import {
	cn,
	formatCompactCurrency,
	formatCurrency,
	formatPercentage,
} from "@/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";

const NftCard = ({
	collection,
	rank,
}: {
	collection: NftCollection;
	rank: number;
}) => {
	const change = collection.floor_price_in_usd_24h_percentage_change;
	const hasChange = change !== null && change !== undefined;
	const isUp = (change ?? 0) >= 0;
	const avatar = collection.image.small_2x || collection.image.small;

	return (
		<Link href={`/nfts/${collection.id}`} className="nft-card">
			<div className="nft-banner">
				{collection.banner_image && (
					<Image
						src={collection.banner_image}
						alt=""
						fill
						sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
						className="banner-img"
					/>
				)}
				<div className="banner-overlay" />

				<span className="nft-rank">#{rank}</span>

				<Image
					src={avatar}
					alt={collection.name}
					width={56}
					height={56}
					className="nft-avatar"
				/>
			</div>

			<div className="nft-body">
				<div className="nft-title">
					<p className="nft-name">{collection.name}</p>
					<p className="nft-symbol">{collection.symbol}</p>
				</div>

				<div className="nft-floor-row">
					<div>
						<p className="nft-label">Floor</p>
						<p className="nft-floor">
							{formatCurrency(collection.floor_price.usd)}
						</p>
						<p className="nft-native">
							{collection.floor_price.native_currency}{" "}
							{collection.native_currency_symbol.toUpperCase()}
						</p>
					</div>

					{hasChange && (
						<span
							className={cn(
								"nft-change",
								isUp ? "text-green-500" : "text-red-500",
							)}
						>
							{isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
							{formatPercentage(change)}
						</span>
					)}
				</div>

				<div className="nft-stats">
					<div>
						<p className="s-label">24h Volume</p>
						<p className="s-value">
							{formatCompactCurrency(collection.volume_24h.usd)}
						</p>
					</div>
					<div>
						<p className="s-label">Market Cap</p>
						<p className="s-value">
							{formatCompactCurrency(collection.market_cap.usd)}
						</p>
					</div>
				</div>
			</div>
		</Link>
	);
};

export default NftCard;
