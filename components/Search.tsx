"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
	CornerDownLeft,
	Loader2,
	Search as SearchIcon,
	SearchX,
	X,
} from "lucide-react";
import { getTrendingCoins, searchCoins } from "@/lib/coingecko.actions";
import SearchItem from "@/components/SearchItem";

const Search = () => {
	const router = useRouter();
	const inputRef = useRef<HTMLInputElement | null>(null);
	const listRef = useRef<HTMLDivElement | null>(null);
	const trendingLoadedRef = useRef(false);

	const [open, setOpen] = useState(false);
	const [query, setQuery] = useState("");
	const [results, setResults] = useState<SearchCoin[]>([]);
	const [resultsQuery, setResultsQuery] = useState("");
	const [trending, setTrending] = useState<TrendingCoin[]>([]);
	const [activeIndex, setActiveIndex] = useState(0);

	const trimmed = query.trim();

	// Derived rather than stored, so the debounced effect never calls setState
	// synchronously. True while a query has no matching results loaded yet.
	const loading = trimmed.length > 0 && resultsQuery !== trimmed;

	const items: SearchItemCoin[] = useMemo(
		() => (trimmed ? results : trending.map((t) => t.item)),
		[trimmed, results, trending],
	);

	// Reset the highlight when the visible list changes, adjusted during render
	// (the React-recommended alternative to a setState-in-effect).
	const [prevItems, setPrevItems] = useState(items);
	if (prevItems !== items) {
		setPrevItems(items);
		setActiveIndex(0);
	}

	// Show placeholder rows while a query is in flight, or while the default
	// trending suggestions are still loading on first open.
	const showSkeleton = loading || (open && !trimmed && trending.length === 0);

	const close = useCallback(() => {
		setOpen(false);
		setQuery("");
		setResults([]);
		setResultsQuery("");
		setActiveIndex(0);
	}, []);

	const handleSelect = useCallback(
		(coinId: string) => {
			router.push(`/coins/${coinId}`);
			close();
		},
		[router, close],
	);

	// On open: lock scroll, focus input, and lazily load trending suggestions.
	useEffect(() => {
		if (!open) return;

		document.body.style.overflow = "hidden";
		inputRef.current?.focus();

		if (!trendingLoadedRef.current) {
			trendingLoadedRef.current = true;
			getTrendingCoins()
				.then(setTrending)
				.catch(() => {});
		}

		return () => {
			document.body.style.overflow = "";
		};
	}, [open]);

	// Debounced search as the user types. All state updates happen inside the
	// async callback, so the effect never calls setState synchronously.
	useEffect(() => {
		if (!trimmed) return;

		let active = true;
		const timer = setTimeout(async () => {
			const coins = await searchCoins(trimmed);
			if (!active) return;
			setResults(coins);
			setResultsQuery(trimmed);
		}, 300);

		return () => {
			active = false;
			clearTimeout(timer);
		};
	}, [trimmed]);

	// Keep the highlighted row scrolled into view.
	useEffect(() => {
		const el = listRef.current?.querySelector(`[data-index="${activeIndex}"]`);
		el?.scrollIntoView({ block: "nearest" });
	}, [activeIndex]);

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "ArrowDown") {
			e.preventDefault();
			setActiveIndex((i) => Math.min(i + 1, items.length - 1));
		} else if (e.key === "ArrowUp") {
			e.preventDefault();
			setActiveIndex((i) => Math.max(i - 1, 0));
		} else if (e.key === "Enter") {
			e.preventDefault();
			const coin = items[activeIndex];
			if (coin) handleSelect(coin.id);
		} else if (e.key === "Escape") {
			e.preventDefault();
			close();
		}
	};

	return (
		<>
			<button
				type="button"
				className="search-trigger"
				onClick={() => setOpen(true)}
				aria-label="Search coins"
			>
				<SearchIcon size={16} />
				<span className="search-trigger-text">Search coins...</span>
			</button>

			{open && (
				<div
					className="search-overlay"
					role="dialog"
					aria-modal="true"
					aria-label="Coin search"
					onMouseDown={close}
				>
					<div
						className="search-modal"
						onMouseDown={(e) => e.stopPropagation()}
					>
						<div className="search-input-row">
							<SearchIcon size={18} className="text-purple-100" />
							<input
								ref={inputRef}
								value={query}
								onChange={(e) => setQuery(e.target.value)}
								onKeyDown={handleKeyDown}
								placeholder="Search coins by name or symbol..."
								className="search-input"
								autoComplete="off"
								spellCheck={false}
							/>
							{loading ? (
								<Loader2 size={18} className="animate-spin text-purple-100" />
							) : query ? (
								<button
									type="button"
									onClick={() => {
										setQuery("");
										inputRef.current?.focus();
									}}
									aria-label="Clear search"
								>
									<X size={18} className="text-purple-100" />
								</button>
							) : null}
						</div>

						<div ref={listRef} className="search-results">
							{showSkeleton ? (
								<div className="search-skeletons">
									{Array.from({ length: 6 }).map((_, i) => (
										<div key={i} className="search-skeleton-row">
											<span className="avatar" />
											<span className="lines">
												<span className="line-1" />
												<span className="line-2" />
											</span>
										</div>
									))}
								</div>
							) : items.length > 0 ? (
								<>
									<p className="search-section-label">
										{trimmed ? "Results" : "Trending"}
									</p>
									{items.map((coin, i) => (
										<div
											key={coin.id}
											data-index={i}
											onMouseMove={() => setActiveIndex(i)}
										>
											<SearchItem
												coin={coin}
												onSelect={handleSelect}
												isActiveName={i === activeIndex}
											/>
										</div>
									))}
								</>
							) : trimmed ? (
								<div className="search-state">
									<SearchX size={28} />
									<p>No coins found for &ldquo;{trimmed}&rdquo;</p>
									<span>Try a different name or symbol.</span>
								</div>
							) : (
								<div className="search-state">
									<SearchIcon size={28} />
									<p>Search thousands of coins</p>
									<span>Find any coin by name or symbol.</span>
								</div>
							)}
						</div>

						<div className="search-footer">
							<span>
								<kbd>↑</kbd>
								<kbd>↓</kbd> navigate
							</span>
							<span>
								<kbd>
									<CornerDownLeft size={11} />
								</kbd>{" "}
								select
							</span>
							<span>
								<kbd>esc</kbd> close
							</span>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default Search;
