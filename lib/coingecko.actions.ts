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

		// CoinGecko returns several error shapes: { error: "msg" },
		// { status: { error_message } }, or { error: { status: { error_message } } }.
		const message =
			errorBody.status?.error_message ||
			(typeof errorBody.error === "string"
				? errorBody.error
				: errorBody.error?.status?.error_message) ||
			response.statusText;

		throw new Error(`API Error: ${response.status}: ${message}`);
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

export async function getGlobalData(): Promise<GlobalData | null> {
	try {
		const { data } = await fetcher<{ data: GlobalData }>(
			"/global",
			undefined,
			120,
		);

		return data ?? null;
	} catch (error) {
		console.error("Error fetching global data:", error);
		return null;
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

interface RawPoolTrade {
	attributes: {
		kind: string;
		from_token_amount: string;
		to_token_amount: string;
		price_from_in_usd: string;
		price_to_in_usd: string;
		volume_in_usd: string;
		block_timestamp: string;
	};
}

// Recent DEX trades for a pool via the GeckoTerminal onchain REST API — the
// free-plan stand-in for the paid live trades WebSocket. `poolId` is the
// GeckoTerminal "network_address" identifier (e.g. "eth_0xabc...").
export async function getPoolTrades(poolId: string): Promise<Trade[]> {
	const sep = poolId.indexOf("_");
	if (sep === -1) return [];

	const network = poolId.slice(0, sep);
	const address = poolId.slice(sep + 1);
	if (!network || !address) return [];

	try {
		const { data } = await fetcher<{ data: RawPoolTrade[] }>(
			`/onchain/networks/${network}/pools/${address}/trades`,
			undefined,
			10,
		);

		return (data ?? []).slice(0, 15).map(({ attributes: a }) => {
			const isBuy = a.kind === "buy";
			return {
				type: isBuy ? "b" : "s",
				price: Number(isBuy ? a.price_to_in_usd : a.price_from_in_usd),
				amount: Number(isBuy ? a.to_token_amount : a.from_token_amount),
				value: Number(a.volume_in_usd),
				timestamp: new Date(a.block_timestamp).getTime(),
			};
		});
	} catch (error) {
		console.error("Error fetching pool trades:", error);
		return [];
	}
}
