import { describe, it, expect } from "vitest";
import {
	cn,
	formatCurrency,
	formatCompactCurrency,
	formatCompactNumber,
	formatPercentage,
	formatDate,
	timeAgo,
	buildPageNumbers,
	ELLIPSIS,
} from "@/lib/utils";

describe("formatCurrency", () => {
	it("formats USD with a narrow $ symbol (not US$)", () => {
		const out = formatCurrency(64002);
		expect(out).toBe("$64,002.00");
		expect(out).not.toContain("US$");
	});

	it("honours a custom digit count", () => {
		expect(formatCurrency(1234.5, 0)).toBe("$1,235");
	});

	it("drops the symbol when showSymbol is false", () => {
		expect(formatCurrency(1234.5, 2, undefined, false)).toBe("1,234.50");
	});

	it("returns a safe fallback for nullish/NaN values", () => {
		expect(formatCurrency(null)).toBe("$0.00");
		expect(formatCurrency(undefined)).toBe("$0.00");
		expect(formatCurrency(NaN)).toBe("$0.00");
		expect(formatCurrency(null, 2, undefined, false)).toBe("0.00");
	});
});

describe("formatCompactCurrency", () => {
	it("abbreviates large values", () => {
		expect(formatCompactCurrency(2_280_000_000_000)).toBe("$2.28T");
		expect(formatCompactCurrency(64_220_000_000)).toBe("$64.22B");
	});

	it("falls back to $0 for nullish values", () => {
		expect(formatCompactCurrency(null)).toBe("$0");
		expect(formatCompactCurrency(NaN)).toBe("$0");
	});
});

describe("formatCompactNumber", () => {
	it("abbreviates large counts", () => {
		expect(formatCompactNumber(1363)).toBe("1.36K");
		expect(formatCompactNumber(448)).toBe("448");
	});

	it("uses an em dash for nullish values", () => {
		expect(formatCompactNumber(null)).toBe("—");
		expect(formatCompactNumber(undefined)).toBe("—");
	});
});

describe("formatPercentage", () => {
	it("formats to one decimal with a percent sign", () => {
		expect(formatPercentage(1.2356)).toBe("1.2%");
		expect(formatPercentage(-3.34)).toBe("-3.3%");
	});

	it("returns 0.0% for nullish values", () => {
		expect(formatPercentage(null)).toBe("0.0%");
		expect(formatPercentage(NaN)).toBe("0.0%");
	});
});

describe("formatDate", () => {
	it("formats an ISO date to a readable en-US date", () => {
		expect(formatDate("2025-10-06T00:00:00.000Z")).toBe("Oct 6, 2025");
	});

	it("returns an em dash for missing/invalid dates", () => {
		expect(formatDate(null)).toBe("—");
		expect(formatDate("not-a-date")).toBe("—");
	});
});

describe("timeAgo", () => {
	it("reports recent timestamps relative to now", () => {
		expect(timeAgo(Date.now() - 5_000)).toBe("just now");
		expect(timeAgo(Date.now() - 5 * 60_000)).toBe("5 min");
		expect(timeAgo(Date.now() - 2 * 60 * 60_000)).toBe("2 hours");
	});

	it("falls back to a YYYY-MM-DD date for old timestamps", () => {
		expect(timeAgo("2020-01-15T00:00:00.000Z")).toBe("2020-01-15");
	});
});

describe("buildPageNumbers", () => {
	it("lists every page when there are few", () => {
		expect(buildPageNumbers(1, 5)).toEqual([1, 2, 3, 4, 5]);
	});

	it("inserts ellipses around the current page for many pages", () => {
		expect(buildPageNumbers(10, 100)).toEqual([
			1,
			ELLIPSIS,
			9,
			10,
			11,
			ELLIPSIS,
			100,
		]);
	});

	it("does not add a leading ellipsis near the start", () => {
		expect(buildPageNumbers(2, 100)).toEqual([1, 2, 3, ELLIPSIS, 100]);
	});
});

describe("cn", () => {
	it("merges conflicting tailwind classes, last wins", () => {
		expect(cn("px-2", "px-4")).toBe("px-4");
	});

	it("drops falsy conditionals", () => {
		expect(cn("a", false && "b", undefined, "c")).toBe("a c");
	});
});
