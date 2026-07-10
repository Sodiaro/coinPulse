"use client";

import Image from "next/image";
import { cn, formatCurrency, formatPercentage } from "@/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";

const SearchItem = ({ coin, onSelect, isActiveName }: SearchItemProps) => {
	// Only trending coins carry price data; plain search results do not.
	const hasMarketData = "data" in coin;
	const price = hasMarketData ? coin.data.price : undefined;
	const change = hasMarketData
		? coin.data.price_change_percentage_24h.usd
		: undefined;
	const isUp = (change ?? 0) >= 0;

	return (
		<button
			type="button"
			onClick={() => onSelect(coin.id)}
			className={cn("search-item", { "is-active": isActiveName })}
		>
			<Image
				src={coin.large}
				alt={coin.name}
				width={32}
				height={32}
				className="coin-img"
			/>

			<div className="coin-name">
				<p>{coin.name}</p>
				<span>{coin.symbol.toUpperCase()}</span>
			</div>

			{price !== undefined ? (
				<div className="coin-price">
					<p>{formatCurrency(price)}</p>
					{change !== undefined && (
						<span
							className={cn(
								"flex items-center gap-0.5",
								isUp ? "text-green-500" : "text-red-500",
							)}
						>
							{isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
							{formatPercentage(change)}
						</span>
					)}
				</div>
			) : coin.market_cap_rank ? (
				<span className="coin-rank">#{coin.market_cap_rank}</span>
			) : null}
		</button>
	);
};

export default SearchItem;
