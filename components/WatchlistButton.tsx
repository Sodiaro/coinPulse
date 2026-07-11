"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWatchlist } from "@/hooks/useWatchlist";

const WatchlistButton = ({
	coinId,
	className,
}: {
	coinId: string;
	className?: string;
}) => {
	const { has, toggle } = useWatchlist();
	const active = has(coinId);

	return (
		<button
			type="button"
			onClick={(e) => {
				e.preventDefault();
				e.stopPropagation();
				toggle(coinId);
			}}
			aria-label={active ? "Remove from watchlist" : "Add to watchlist"}
			aria-pressed={active}
			className={cn("watchlist-btn", active && "is-active", className)}
		>
			<Star size={18} className={cn(active && "fill-current")} />
		</button>
	);
};

export default WatchlistButton;
