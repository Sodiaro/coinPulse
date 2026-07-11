import { getGlobalData } from "@/lib/coingecko.actions";
import { cn, formatCompactCurrency, formatPercentage } from "@/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";
import { MarketStatsFallback } from "./fallback";

const MarketStats = async () => {
	const data = await getGlobalData();

	if (!data) return <MarketStatsFallback />;

	const stats: { label: string; value: string; change?: number }[] = [
		{
			label: "Market Cap",
			value: formatCompactCurrency(data.total_market_cap.usd),
			change: data.market_cap_change_percentage_24h_usd,
		},
		{
			label: "24h Volume",
			value: formatCompactCurrency(data.total_volume.usd),
			change: data.volume_change_percentage_24h_usd,
		},
		{
			label: "BTC Dominance",
			value: `${data.market_cap_percentage.btc.toFixed(1)}%`,
		},
		{
			label: "Active Coins",
			value: data.active_cryptocurrencies.toLocaleString("en-US"),
		},
	];

	return (
		<div id="market-stats">
			{stats.map(({ label, value, change }) => {
				const isUp = (change ?? 0) >= 0;

				return (
					<div className="stat-card" key={label}>
						<p className="stat-label">{label}</p>

						<div className="stat-value-row">
							<p className="stat-value">{value}</p>

							{change !== undefined && (
								<span
									className={cn(
										"stat-change",
										isUp ? "text-green-500" : "text-red-500",
									)}
								>
									{isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
									{formatPercentage(change)}
								</span>
							)}
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default MarketStats;
