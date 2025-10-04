"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
	{ href: "/", label: "Dashboard" },
	{ href: "/clusters", label: "Segments" },
	{ href: "/packages", label: "Coupons & Packages" },
	{ href: "/scheduling", label: "Scheduling" },
	{ href: "/notifications", label: "Notifications" },
];

export function Sidebar() {
	const pathname = usePathname();

	return (
		<aside className="border-r bg-white sticky top-0 h-screen">
			<div className="px-4 py-4 flex items-center gap-2">
				<img src="/enuygun-logo.svg" alt="Enuygun" className="h-6" />
				<span className="font-semibold text-[15px] text-[var(--brand)]">
					Manager Portal
				</span>
			</div>
			<nav className="flex flex-col px-2 gap-1">
				{links.map((l) => {
					const active =
						pathname === l.href ||
						(l.href !== "/" && pathname.startsWith(l.href));
					return (
						<Link
							key={l.href}
							href={l.href}
							className={`rounded px-3 py-2 text-sm transition-colors ${
								active
									? "bg-[var(--brand)] text-white"
									: "hover:bg-gray-100 text-gray-700"
							}`}
						>
							{l.label}
						</Link>
					);
				})}
			</nav>
		</aside>
	);
}


