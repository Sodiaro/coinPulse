"use server";

import qs from "query-string";

const BASE_URL = process.env.COINGECKO_BASE_URL;
const API_KEY = process.env.COINGECKO_API_KEY;

if (!BASE_URL) throw new Error("Could not get base url");
if (!API_KEY) throw new Error("Could not get api key");

export async function fetcher<T>(
	endpoint: string,
	params?: QueryParams,
	revalidate = 60,
): Promise<T> {
	const url = qs.stringifyUrl(
		{
			url: `${BASE_URL}/${endpoint}`,
			query: params,
		},
		{ skipEmptyString: true, skipNull: true },
	);

	const response = await fetch(url, {
		headers: {
			"x-cg-demo-api-key": API_KEY,
			"Content-Type": "application/json",
		} as Record<string, string>,
		next: { revalidate },
	});

	if (!response.ok) {
		const errorBody: CoinGeckoErrorBody = await response
			.json()
			.catch(() => ({}));

		throw new Error(
			`API Error: ${response.status}: ${errorBody.error || response.statusText} `,
		);
	}

	return response.json();
}

export async function getPools(
	id: string,
	network?: string | null,
	contractAddress?: string | null,
): Promise<PoolData> {
	const fallback: PoolData = {
		id: "",
		address: "",
		name: "",
		network: "",
	};

	if (network && contractAddress) {
		try {
			const poolData = await fetcher<{ data: PoolData[] }>(
				`/onchain/networks/${network}/tokens/${contractAddress}/pools`,
			);

			return poolData.data?.[0] ?? fallback;
		} catch (error) {
			console.log(error);
			return fallback;
		}
	}

	try {
		const poolData = await fetcher<{ data: PoolData[] }>(
			"/onchain/search/pools",
			{ query: id },
		);

		return poolData.data?.[0] ?? fallback;
	} catch {
		return fallback;
	}
}

export async function searchCoins(query: string): Promise<SearchCoin[]> {
	const trimmed = query.trim();
	if (!trimmed) return [];

	try {
		const { coins } = await fetcher<{ coins: SearchCoin[] }>("/search", {
			query: trimmed,
		});

		return coins ?? [];
	} catch (error) {
		console.error("Error searching coins:", error);
		return [];
	}
}

export async function getTrendingCoins(): Promise<TrendingCoin[]> {
	try {
		const { coins } = await fetcher<{ coins: TrendingCoin[] }>(
			"/search/trending",
			undefined,
			300,
		);

		return coins ?? [];
	} catch (error) {
		console.error("Error fetching trending coins:", error);
		return [];
	}
}
