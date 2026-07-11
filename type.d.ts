type OHLCData = [number, number, number, number, number];

interface NextPageProps {
	params: Promise<{ [key: string]: string }>;
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

interface CandlestickChartProps {
	data?: OHLCData[];
	liveOhlcv?: OHLCData | null;
	coinId: string;
	height?: number;
	children?: React.ReactNode;
	mode?: "historical" | "live";
	initialPeriod?: Period;
	liveInterval?: "1s" | "1m";
	setLiveInterval?: (interval: "1s" | "1m") => void;
}

interface ConverterProps {
	symbol: string;
	icon: string;
	priceList: Record<string, number>;
}

interface Ticker {
	market: {
		name: string;
	};
	base: string;
	target: string;
	converted_last: {
		usd: number;
	};
	timestamp: string;
	trade_url: string;
}

type Period = "daily" | "weekly" | "monthly" | "3months" | "6months" | "yearly";

interface CoinMarketData {
	id: string;
	symbol: string;
	name: string;
	image: string;
	current_price: number;
	market_cap: number;
	market_cap_rank: number;
	fully_diluted_valuation: number;
	total_volume: number;
	high_24h: number;
	low_24h: number;
	price_change_24h: number;
	price_change_percentage_24h: number;
	market_cap_change_24h: number;
	market_cap_change_percentage_24h: number;
	circulating_supply: number;
	total_supply: number;
	max_supply: number;
	ath: number;
	ath_change_percentage: number;
	ath_date: string;
	atl: number;
	atl_change_percentage: number;
	atl_date: string;
	last_updated: string;
}

interface TrendingCoin {
	item: {
		id: string;
		name: string;
		symbol: string;
		market_cap_rank: number;
		thumb: string;
		large: string;
		data: {
			price: number;
			price_change_percentage_24h: {
				usd: number;
			};
		};
	};
}

// Shape returned by CoinGecko's /search endpoint. Unlike trending coins, search
// results carry no price/change data — only identity and rank.
interface SearchCoin {
	id: string;
	name: string;
	symbol: string;
	api_symbol?: string;
	market_cap_rank: number | null;
	thumb: string;
	large: string;
}

// Chart Section Props (used in ChartSection.tsx)
interface ChartSectionProps {
	coinData: {
		image: { large: string };
		name: string;
		symbol: string;
		market_data: {
			current_price: { usd: number };
		};
	};
	coinOHLCData: OHLCData[];
	coinId: string;
}

interface TopGainersLosers {
	id: string;
	name: string;
	symbol: string;
	image: string;
	price: number;
	priceChangePercentage24h: number;
}

interface TopGainersLosersResponse {
	id: string;
	name: string;
	symbol: string;
	image: string;
	usd: number;
	usd_24h_change: number;
	usd_24h_vol: number;
	market_cap_rank: number;
}

interface PriceData {
	usd: number;
}

interface Trade {
	price?: number;
	timestamp?: number;
	type?: string;
	amount?: number;
	value?: number;
}

interface ExtendedPriceData {
	usd: number;
	coin?: string;
	price?: number;
	change24h?: number;
	marketCap?: number;
	volume24h?: number;
	timestamp?: number;
}

interface WebSocketMessage {
	type?: string;
	c?: string;
	ch?: string;
	i?: string;
	p?: number;
	pp?: number;
	pu?: number;
	m?: number;
	v?: number;
	vo?: number;
	o?: number;
	h?: number;
	l?: number;
	t?: number;
	to?: number;
	ty?: string;
	channel?: string;
	identifier?: string;
}

interface CoinDetailsData {
	id: string;
	name: string;
	symbol: string;
	asset_platform_id?: string | null;
	detail_platforms?: Record<
		string,
		{
			geckoterminal_url: string;
			contract_address: string;
		}
	>;
	image: {
		large: string;
		small: string;
	};
	market_data: {
		current_price: {
			usd: number;
			[key: string]: number;
		};
		price_change_24h_in_currency: {
			usd: number;
		};
		price_change_percentage_24h_in_currency: {
			usd: number;
		};
		price_change_percentage_30d_in_currency: {
			usd: number;
		};
		market_cap: {
			usd: number;
		};
		total_volume: {
			usd: number;
		};
		high_24h: { usd: number };
		low_24h: { usd: number };
		ath: { usd: number };
		ath_change_percentage: { usd: number };
		ath_date: { usd: string };
		atl: { usd: number };
		atl_change_percentage: { usd: number };
		atl_date: { usd: string };
		fully_diluted_valuation: { usd?: number };
		circulating_supply: number;
		total_supply: number | null;
		max_supply: number | null;
	};
	market_cap_rank: number;
	description: {
		en: string;
	};
	links: {
		homepage: string[];
		blockchain_site: string[];
		subreddit_url: string;
	};
	tickers: Ticker[];
}

interface LiveDataProps {
	coinId: string;
	poolId: string;
	coin: CoinDetailsData;
	coinOHLCData?: OHLCData[];
	children?: React.ReactNode;
}

interface LiveCoinHeaderProps {
	name: string;
	image: string;
	livePrice?: number;
	livePriceChangePercentage24h: number;
	priceChangePercentage30d: number;
	priceChange24h: number;
}

interface Category {
	name: string;
	top_3_coins: string[];
	market_cap_change_24h: number;
	market_cap: number;
	volume_24h: number;
}

interface GlobalData {
	active_cryptocurrencies: number;
	markets: number;
	total_market_cap: { usd: number };
	total_volume: { usd: number };
	market_cap_percentage: { btc: number; eth: number };
	market_cap_change_percentage_24h_usd: number;
	volume_change_percentage_24h_usd: number;
}

interface ExchangeData {
	id: string;
	name: string;
	year_established: number | null;
	country: string | null;
	url: string;
	image: string;
	trust_score: number | null;
	trust_score_rank: number | null;
	trade_volume_24h_btc: number;
}

interface ExchangeTicker {
	base: string;
	target: string;
	market: { name: string; identifier: string };
	last: number;
	converted_last: { usd: number };
	converted_volume: { usd: number };
	bid_ask_spread_percentage: number;
	trade_url: string | null;
}

interface ExchangeDetails {
	name: string;
	year_established: number | null;
	country: string | null;
	description: string;
	url: string;
	image: string;
	facebook_url?: string;
	reddit_url?: string;
	telegram_url?: string;
	twitter_handle?: string;
	centralized: boolean;
	trust_score: number | null;
	trust_score_rank: number | null;
	coins: number;
	pairs: number;
	trade_volume_24h_btc: number;
	tickers: ExchangeTicker[];
}

interface NftCollection {
	id: string;
	web_slug: string;
	name: string;
	symbol: string;
	image: { small: string; small_2x?: string };
	banner_image?: string;
	native_currency_symbol: string;
	floor_price: { native_currency: number; usd: number };
	floor_price_in_usd_24h_percentage_change: number;
	market_cap: { usd: number };
	volume_24h: { usd: number };
}

interface NftDetails {
	id: string;
	name: string;
	symbol: string;
	image: { small: string; small_2x?: string };
	banner_image?: string;
	description: string;
	native_currency_symbol: string;
	market_cap_rank: number | null;
	floor_price: { native_currency: number; usd: number };
	floor_price_in_usd_24h_percentage_change: number;
	market_cap: { usd: number };
	volume_24h: { usd: number };
	one_day_sales: number;
	number_of_unique_addresses: number;
	total_supply: number;
	links: { homepage?: string; twitter?: string; discord?: string };
}

interface UseCoinGeckoWebSocketProps {
	coinId: string;
	poolId: string;
	liveInterval?: "1s" | "1m";
}

interface UseCoinGeckoWebSocketReturn {
	price: ExtendedPriceData | null;
	trades: Trade[];
	ohlcv: OHLCData | null;
	isConnected: boolean;
}

interface DataTableColumn<T> {
	header: React.ReactNode;
	cell: (row: T, index: number) => React.ReactNode;
	headClassName?: string;
	cellClassName?: string;
}

interface DataTableProps<T> {
	columns: DataTableColumn<T>[];
	data: T[];
	rowKey: (row: T, index: number) => React.Key;
	tableClassName?: string;
	headerClassName?: string;
	headerRowClassName?: string;
	headerCellClassName?: string;
	bodyRowClassName?: string;
	bodyCellClassName?: string;
}

type ButtonSize = "default" | "sm" | "lg" | "icon" | "icon-sm" | "icon-lg";

type PaginationLinkProps = {
	isActive?: boolean;
	size?: ButtonSize;
} & React.ComponentProps<"a">;

interface Pagination {
	currentPage: number;
	totalPages: number;
	hasMorePages: boolean;
}

interface HeaderProps {
	trendingCoins: TrendingCoin[];
}

type SearchItemCoin = SearchCoin | TrendingCoin["item"];

interface SearchItemProps {
	coin: SearchItemCoin;
	onSelect: (coinId: string) => void;
	isActiveName: boolean;
}

interface CoinGeckoErrorStatus {
	error_code?: number;
	error_message?: string;
}

interface CoinGeckoErrorBody {
	error?: string | { status?: CoinGeckoErrorStatus };
	status?: CoinGeckoErrorStatus;
}

type QueryParams = Record<string, string | number | boolean | undefined>;

interface PoolData {
	id: string;
	address: string;
	name: string;
	network: string;
}
