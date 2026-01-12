"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import type { SiteContent } from "@/lib/siteContentTypes";

type MenuItem = {
    label: string;
    href?: string;
    children?: { label: string; href: string }[];
};

const menuItems: MenuItem[] = [
    { label: "Projects", href: "#projects" },
    { label: "Achievements", href: "#achievements" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "Publications", href: "#publications" },
    { label: "Awards", href: "#awards" },
    { label: "Grants", href: "#grants" },
    { label: "Media", href: "#media" },
    {
        label: "More",
        children: [
            { label: "Teaching", href: "#teaching" },
            { label: "Supervision", href: "#supervision" },
            { label: "Peer-Reviews", href: "#peer-reviews" },
            { label: "Editorial Roles", href: "#editorial" },
            { label: "Conference Contributions", href: "#conference" },
            { label: "Committee and Board Duties", href: "#committee" },
            { label: "News", href: "#news" },
            { label: "CV", href: "#cv" },
            { label: "Contact", href: "#contact" },
        ],
    },
];

const Header = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [mobileMoreOpen, setMobileMoreOpen] = useState(false);
    const [displayName, setDisplayName] = useState("Prof. (Dr.) Nilam Panchal");

    useEffect(() => {
        let active = true;
        const load = async () => {
            const response = await fetch("/api/content", { cache: "no-store" });
            if (!response.ok) return;
            const data = (await response.json()) as SiteContent;
            if (active && data.sidebarName) {
                setDisplayName(data.sidebarName);
            }
        };
        load();
        return () => {
            active = false;
        };
    }, []);

    return (
        <header className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-[#0F2B3A] via-[#103547] to-[#0F2B3A] text-[#F6F1E7] shadow-lg border-b border-white/10">
            <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-4">
                {/* Logo / Name */}
                <Link href="/" className="text-xl font-semibold tracking-wide text-[#F6F1E7] hover:text-white transition-colors">
                    {displayName}
                </Link>

                {/* Desktop Menu */}
                <nav className="hidden md:flex items-center gap-6 text-base font-medium">
                    {menuItems.map((item) =>
                        item.children ? (
                            <div key={item.label} className="relative group">
                                <button className="flex items-center gap-1 py-1 text-[#F6F1E7] hover:text-[#F2D7A0] transition-colors">
                                    {item.label}
                                    <ChevronDown size={16} />
                                </button>

                                <div className="absolute right-0 top-full mt-2 w-64 rounded-xl bg-white text-gray-800 shadow-xl ring-1 ring-black/10 py-2 opacity-0 invisible translate-y-1 transition-all duration-150 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0">
                                    {item.children.map((child) => (
                                        <Link
                                            key={child.label}
                                            href={child.href}
                                            className="block px-4 py-2 text-base hover:bg-[#F8F1E3] hover:text-[#7A4C2C] transition-colors"
                                        >
                                            {child.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <Link
                                key={item.label}
                                href={item.href!}
                                className="py-1 text-[#F6F1E7] hover:text-[#F2D7A0] transition-colors"
                            >
                                {item.label}
                            </Link>
                        )
                    )}
                </nav>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden rounded-md p-1 hover:bg-white/10 transition-colors text-[#F6F1E7]"
                    onClick={() =>
                        setMobileOpen((prev) => {
                            const next = !prev;
                            if (!next) {
                                setMobileMoreOpen(false);
                            }
                            return next;
                        })
                    }
                    aria-expanded={mobileOpen}
                    aria-label="Toggle navigation"
                >
                    {mobileOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="md:hidden bg-[#0D2A36] px-4 pb-4 border-t border-white/10">
                    {menuItems.map((item) =>
                        item.children ? (
                            <div key={item.label} className="mt-2">
                                <button
                                    className="w-full flex items-center justify-between font-semibold py-2 text-[#F6F1E7] hover:text-white transition-colors"
                                    onClick={() => setMobileMoreOpen(!mobileMoreOpen)}
                                    aria-expanded={mobileMoreOpen}
                                >
                                    <span>{item.label}</span>
                                    <ChevronDown size={16} className={mobileMoreOpen ? "rotate-180 transition-transform" : "transition-transform"} />
                                </button>
                                {mobileMoreOpen && (
                                    <div className="pl-3 space-y-1">
                                        {item.children.map((child) => (
                                            <Link
                                                key={child.label}
                                                href={child.href}
                                                onClick={() => {
                                                    setMobileOpen(false);
                                                    setMobileMoreOpen(false);
                                                }}
                                                className="block text-sm text-[#EADFCF] hover:text-white transition-colors"
                                            >
                                                {child.label}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                key={item.label}
                                href={item.href!}
                                onClick={() => {
                                    setMobileOpen(false);
                                    setMobileMoreOpen(false);
                                }}
                                className="block mt-2 py-1 text-[#EADFCF] hover:text-[#F2D7A0] transition-colors"
                            >
                                {item.label}
                            </Link>
                        )
                    )}
                </div>
            )}
        </header>
    );
}

export default Header;
