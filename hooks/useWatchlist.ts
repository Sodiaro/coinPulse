"use client";

import { useCallback, useSyncExternalStore } from "react";

const KEY = "cryptopulse:watchlist";
const EVENT = "watchlist:change";
const EMPTY: string[] = [];

// Cached snapshot so useSyncExternalStore gets a stable reference until the
// stored value actually changes
let cache: string[] = EMPTY;
let cacheRaw = "";

function getSnapshot(): string[] {
	if (typeof window === "undefined") return EMPTY;
	const raw = window.localStorage.getItem(KEY) ?? "[]";
	if (raw !== cacheRaw) {
		cacheRaw = raw;
		try {
			cache = JSON.parse(raw) as string[];
		} catch {
			cache = EMPTY;
		}
	}
	return cache;
}

function getServerSnapshot(): string[] {
	return EMPTY;
}

function subscribe(callback: () => void) {
	// `watchlist:change` syncs within the tab; `storage` syncs across tabs.
	window.addEventListener(EVENT, callback);
	window.addEventListener("storage", callback);
	return () => {
		window.removeEventListener(EVENT, callback);
		window.removeEventListener("storage", callback);
	};
}

export function useWatchlist() {
	const ids = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

	const has = useCallback((id: string) => ids.includes(id), [ids]);

	const toggle = useCallback((id: string) => {
		const current = getSnapshot();
		const next = current.includes(id)
			? current.filter((x) => x !== id)
			: [...current, id];
		window.localStorage.setItem(KEY, JSON.stringify(next));
		window.dispatchEvent(new Event(EVENT));
	}, []);

	return { ids, has, toggle };
}
