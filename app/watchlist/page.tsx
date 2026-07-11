"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn, formatCurrency, formatPercentage } from "@/lib/utils";
import { getMarketsByIds } from "@/lib/coingecko.actions";
import { useWatchlist } from "@/hooks/useWatchlist";
import DataTable from "@/components/DataTable";
import WatchlistButton from "@/components/WatchlistButton";

const WatchlistPage = () => {
	const { ids } = useWatchlist();
	const [coins, setCoins] = useState<CoinMarketData[]>([]);
	const [fetchedKey, setFetchedKey] = useState("");

	const key = ids.join(",");

	useEffect(() => {
		if (ids.length === 0) return;

		let active = true;
		getMarketsByIds(ids).then((data) => {
			if (!active) return;
			setCoins(data);
			setFetchedKey(ids.join(","));
		});

		return () => {
			active = false;
		};
	}, [ids]);

	// Derived (not stored) so the effect never calls setState synchronously.
	const loading = ids.length > 0 && fetchedKey !== key;

	// Filter by the current ids so un-starring a row removes it instantly,
	// before the background refetch resolves.
	const visible = coins.filter((c) => ids.includes(c.id));

	const columns: DataTableColumn<CoinMarketData>[] = [
		{
			header: "Rank",
			cellClassName: "rank-cell",
			cell: (coin) => (
				<>
					#{coin.market_cap_rank ?? "—"}
					<Link href={`/coins/${coin.id}`} aria-label="View coin" />
				</>
			),
		},
		{
			header: "Token",
			cellClassName: "token-cell",
			cell: (coin) => (
				<div className="token-info">
					<Image src={coin.image} alt={coin.name} width={36} height={36} />
					<p>
						{coin.name} ({coin.symbol.toUpperCase()})
					</p>
				</div>
			),
		},
		{
			header: "Price",
			cellClassName: "price-cell",
			cell: (coin) => formatCurrency(coin.current_price),
		},
		{
			header: "24h Change",
			cellClassName: "change-cell",
			cell: (coin) => {
				const isUp = coin.price_change_percentage_24h > 0;
				return (
					<span
						className={cn("change-value", {
							"text-green-600": isUp,
							"text-red-500": !isUp,
						})}
					>
						{isUp && "+"}
						{formatPercentage(coin.price_change_percentage_24h)}
					</span>
				);
			},
		},
		{
			header: "Market Cap",
			headClassName: "max-sm:hidden",
			cellClassName: "market-cap-cell max-sm:hidden",
			cell: (coin) => formatCurrency(coin.market_cap),
		},
		{
			header: "",
			cellClassName: "star-cell",
			cell: (coin) => <WatchlistButton coinId={coin.id} />,
		},
	];

	return (
		<main id="watchlist-page">
			<div className="content">
				<h4>Watchlist</h4>

				{loading ? (
					<p className="watchlist-message">Loading your watchlist…</p>
				) : visible.length > 0 ? (
					<DataTable
						tableClassName="coins-table"
						columns={columns}
						data={visible}
						rowKey={(coin) => coin.id}
					/>
				) : (
					<div className="watchlist-empty">
						<p className="title">Your watchlist is empty</p>
						<p className="sub">
							Star coins with the ☆ icon to track them here.
						</p>
						<Link href="/coins" className="browse-link">
							Browse all coins
						</Link>
					</div>
				)}
			</div>
		</main>
	);
};

export default WatchlistPage;
