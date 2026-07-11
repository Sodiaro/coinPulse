// Force IPv4-first DNS resolution for server-side requests.

export async function register() {
	if (process.env.NEXT_RUNTIME === "nodejs") {
		const { setDefaultResultOrder } = await import("node:dns");
		setDefaultResultOrder("ipv4first");
	}
}
