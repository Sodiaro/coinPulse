"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Search from "@/components/Search";

const links = [
	{ href: "/", label: "Home" },
	{ href: "/coins", label: "All Coins" },
	{ href: "/watchlist", label: "Watchlist" },
	{ href: "/nfts", label: "NFTs" },
	{ href: "/exchanges", label: "Exchanges" },
];

const Header = () => {
	const pathname = usePathname();
	const [open, setOpen] = useState(false);

	const [prevPath, setPrevPath] = useState(pathname);
	if (prevPath !== pathname) {
		setPrevPath(pathname);
		setOpen(false);
	}

	return (
		<header>
			<div className="main-container inner">
				<Link href="/" className="logo">
					CryptoPulse
				</Link>

				<div className="header-right">
					<nav className="desktop-nav">
						{links.map(({ href, label }) => (
							<Link
								key={href}
								href={href}
								className={cn("nav-link", { "is-active": pathname === href })}
							>
								{label}
							</Link>
						))}
					</nav>

					<Search />

					<button
						type="button"
						className="menu-toggle"
						aria-label="Toggle menu"
						aria-expanded={open}
						onClick={() => setOpen((v) => !v)}
					>
						{open ? <X size={22} /> : <Menu size={22} />}
					</button>
				</div>
			</div>

			{open && (
				<nav className="mobile-nav">
					{links.map(({ href, label }) => (
						<Link
							key={href}
							href={href}
							className={cn("mobile-nav-link", {
								"is-active": pathname === href,
							})}
						>
							{label}
						</Link>
					))}
				</nav>
			)}
		</header>
	);
};

export default Header;
