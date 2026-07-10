"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Search from "@/components/Search";

const Header = () => {
	const pathname = usePathname();

	return (
		<header>
			<div className="main-container inner">
				<Link href="/" className="logo">
					CryptoPulse
				</Link>

				<nav>
					<Link
						href="/"
						className={cn("nav-link", {
							"is-active": pathname === "/",
							"is-home": true,
						})}
					>
						Home
					</Link>

					<Search />

					<Link
						href="/coins"
						className={cn("nav-link", {
							"is-active": pathname === "/coins",
						})}
					>
						All Coins
					</Link>
				</nav>
			</div>
		</header>
	);
};

export default Header;
