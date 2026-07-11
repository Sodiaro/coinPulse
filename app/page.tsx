import React, { Suspense } from "react";
import CoinOverview from "@/components/home/CoinOverview";
import TrendingCoins from "@/components/home/TrendingCoins";
import {
	CategoriesFallback,
	CoinOverviewFallback,
	MarketStatsFallback,
	TrendingCoinsFallback,
} from "@/components/home/fallback";
import Categories from "@/components/home/Categories";
import MarketStats from "@/components/home/MarketStats";

const Page = async () => {
	return (
		<main className="main-container">
			<Suspense fallback={<MarketStatsFallback />}>
				<MarketStats />
			</Suspense>

			<section className="home-grid">
				<Suspense fallback={<CoinOverviewFallback />}>
					<CoinOverview />
				</Suspense>

				<Suspense fallback={<TrendingCoinsFallback />}>
					<TrendingCoins />
				</Suspense>
			</section>

			<section className="w-full mt-7 space-y-4">
				<Suspense fallback={<CategoriesFallback />}>
					<Categories />
				</Suspense>
			</section>
		</main>
	);
};

export default Page;
