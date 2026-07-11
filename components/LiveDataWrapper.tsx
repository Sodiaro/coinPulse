"use client";

import { Separator } from "@/components/ui/separator";
import CandlestickChart from "@/components/CandlestickChart";
import { useCoinGeckoWebSocket } from "@/hooks/useCoinGeckoWebSocket";
import DataTable from "@/components/DataTable";
import { cn, formatCurrency, timeAgo } from "@/lib/utils";
import { getPoolTrades } from "@/lib/coingecko.actions";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import CoinHeader from "@/components/CoinHeader";

const COLLAPSED_TRADES = 5;

const LiveDataWrapper = ({
	coinId,
	poolId,
	coin,
	coinOHLCData,
}: LiveDataProps) => {
	const [liveInterval, setLiveInterval] = useState<"1s" | "1m">("1s");
	const { trades, ohlcv, price } = useCoinGeckoWebSocket({
		coinId,
		poolId,
		liveInterval,
	});

	// The live trades WebSocket is a paid feature, so poll the onchain REST
	// endpoint for recent pool trades instead. WebSocket trades win when present.
	const [restTrades, setRestTrades] = useState<Trade[]>([]);

	useEffect(() => {
		if (!poolId) return;

		let active = true;
		const load = async () => {
			const data = await getPoolTrades(poolId);
			if (active) setRestTrades(data);
		};

		load();
		const id = setInterval(load, 12000);

		return () => {
			active = false;
			clearInterval(id);
		};
	}, [poolId]);

	const recentTrades = trades.length > 0 ? trades : restTrades;

	const [showAllTrades, setShowAllTrades] = useState(false);
	const hasMoreTrades = recentTrades.length > COLLAPSED_TRADES;
	const visibleTrades =
		showAllTrades || !hasMoreTrades
			? recentTrades
			: recentTrades.slice(0, COLLAPSED_TRADES);

	const tradeColumns: DataTableColumn<Trade>[] = [
		{
			header: "Price",
			cellClassName: "price-cell",
			cell: (trade) => (trade.price ? formatCurrency(trade.price) : "-"),
		},
		{
			header: "Amount",
			cellClassName: "amount-cell",
			cell: (trade) => trade.amount?.toFixed(4) ?? "-",
		},
		{
			header: "Value",
			cellClassName: "value-cell",
			cell: (trade) => (trade.value ? formatCurrency(trade.value) : "-"),
		},
		{
			header: "Buy/Sell",
			cellClassName: "type-cell",
			cell: (trade) => (
				<span
					className={trade.type === "b" ? "text-green-500" : "text-red-500"}
				>
					{trade.type === "b" ? "Buy" : "Sell"}
				</span>
			),
		},
		{
			header: "Time",
			cellClassName: "time-cell",
			cell: (trade) => (trade.timestamp ? timeAgo(trade.timestamp) : "-"),
		},
	];

	return (
		<section id="live-data-wrapper">
			<CoinHeader
				name={coin.name}
				image={coin.image.large}
				livePrice={price?.usd ?? coin.market_data.current_price.usd}
				livePriceChangePercentage24h={
					price?.change24h ??
					coin.market_data.price_change_percentage_24h_in_currency.usd
				}
				priceChangePercentage30d={
					coin.market_data.price_change_percentage_30d_in_currency.usd
				}
				priceChange24h={coin.market_data.price_change_24h_in_currency.usd}
			/>
			<Separator className="divider" />

			<div className="trend">
				<CandlestickChart
					coinId={coinId}
					data={coinOHLCData}
					liveOhlcv={ohlcv}
					mode="live"
					initialPeriod="daily"
					liveInterval={liveInterval}
					setLiveInterval={setLiveInterval}
				>
					<h4>Trend Overview</h4>
				</CandlestickChart>
			</div>

			<Separator className="divider" />

			{poolId && (
				<div className="trades">
					<h4>Recent Trades</h4>

					{recentTrades.length > 0 ? (
						<>
							<div
								className={cn(
									"trades-wrapper",
									hasMoreTrades && !showAllTrades && "is-collapsed",
								)}
							>
								<DataTable
									columns={tradeColumns}
									data={visibleTrades}
									rowKey={(_, index) => index}
									tableClassName="trades-table"
								/>
							</div>

							{hasMoreTrades && (
								<button
									type="button"
									className="trades-toggle"
									onClick={() => setShowAllTrades((v) => !v)}
								>
									{showAllTrades
										? "Show less"
										: `Show ${recentTrades.length - COLLAPSED_TRADES} more`}
									<ChevronDown
										size={16}
										className={cn("chevron", showAllTrades && "is-open")}
									/>
								</button>
							)}
						</>
					) : (
						<p className="no-trades">Loading recent trades…</p>
					)}
				</div>
			)}
		</section>
	);
};

export default LiveDataWrapper;
