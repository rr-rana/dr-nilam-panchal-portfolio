"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { MORE_PAGES, PRIMARY_PAGES } from "@/lib/pages";
import { usePathname } from "next/navigation";

type MenuItem = {
    label: string;
    href?: string;
    children?: { label: string; href: string }[];
};

type HeaderProps = {
    displayName?: string;
};

const Header = ({ displayName }: HeaderProps) => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [mobileMoreOpen, setMobileMoreOpen] = useState(false);
    const [showShadow, setShowShadow] = useState(false);
    const name = displayName || "Prof. (Dr.) Nilam Panchal";
    const pathname = usePathname();
    const effectivePathname = pathname || "";
    const isAdminRoute = /^\/admin(?:\/|$)/.test(effectivePathname || "");

    const menuItems: MenuItem[] = useMemo(() => {
        const base = isAdminRoute ? "/admin" : "";
        return [
            ...PRIMARY_PAGES.map((page) => ({
                label: page.label,
                href: `${base}/${page.slug}`,
            })),
            {
                label: "More",
                children: MORE_PAGES.map((page) => ({
                    label: page.label,
                    href: `${base}/${page.slug}`,
                })),
            },
        ];
    }, [isAdminRoute]);

    const isActive = (href?: string) => {
        if (!href || !effectivePathname) return false;
        return (
            effectivePathname === href ||
            effectivePathname.startsWith(`${href}/`)
        );
    };

    useEffect(() => {
        const handleScroll = () => {
            setShowShadow(window.scrollY > 50);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    if (isAdminRoute) {
        return (
            <header className={`fixed top-0 left-0 w-full z-50 bg-linear-to-r from-[#0F2B3A] via-[#103547] to-[#0F2B3A] text-[#F6F1E7] border-b border-white/10 transition-shadow ${showShadow ? "shadow-lg" : "shadow-none"}`}>
                <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-4">
                    <Link href="/" className="text-xl font-semibold tracking-wide text-[#F6F1E7] hover:text-white transition-colors">
                        {name}
                    </Link>

                    <nav className="hidden md:flex items-center gap-6 text-base font-medium">
                        {menuItems.map((item) =>
                            item.children ? (
                                <div key={item.label} className="relative group">
                                    <button
                                        className={`flex items-center gap-1 py-1 transition-colors ${
                                            item.children.some((child) => isActive(child.href))
                                                ? "text-[#F6F1E7] border-b border-white"
                                                : "text-[#F6F1E7] hover:text-[#F2D7A0]"
                                        }`}
                                    >
                                        {item.label}
                                        <ChevronDown size={16} />
                                    </button>

                                    <div className="absolute right-0 top-full mt-2 w-64 rounded-xl bg-white text-gray-800 shadow-xl ring-1 ring-black/10 py-2 opacity-0 invisible translate-y-1 transition-all duration-150 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0">
                                        {item.children.map((child) => (
                                            <Link
                                                key={child.label}
                                                href={child.href}
                                                className={`block px-4 py-2 text-base transition-colors ${
                                                    isActive(child.href)
                                                        ? "bg-[#F8F1E3] text-[#7A4C2C] font-semibold"
                                                        : "hover:bg-[#F8F1E3] hover:text-[#7A4C2C]"
                                                }`}
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
                                    className={`py-1 transition-colors ${
                                        isActive(item.href)
                                            ? "text-[#F6F1E7] border-b border-white"
                                            : "text-[#F6F1E7] hover:text-[#F2D7A0]"
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            )
                        )}
                    </nav>

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

                {mobileOpen && (
                    <div className="md:hidden bg-[#0D2A36] px-4 pb-4 border-t border-white/10">
                        {menuItems.map((item) =>
                            item.children ? (
                                <div key={item.label} className="mt-2">
                                    <button
                                        className={`w-full flex items-center justify-between font-semibold py-2 transition-colors ${
                                            item.children.some((child) => isActive(child.href))
                                                ? "text-[#6EE7B7]"
                                                : "text-[#F6F1E7] hover:text-white"
                                        }`}
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
                                                    className={`block text-sm transition-colors ${
                                                        isActive(child.href)
                                                            ? "text-[#6EE7B7] font-semibold"
                                                            : "text-[#EADFCF] hover:text-white"
                                                    }`}
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
                                    className={`block mt-2 py-1 transition-colors ${
                                        isActive(item.href)
                                            ? "text-[#6EE7B7]"
                                            : "text-[#EADFCF] hover:text-[#6EE7B7]"
                                    }`}
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

    return (
        <header className={`fixed top-0 left-0 w-full z-50 border-b border-[#d9e3ea] bg-white/92 text-[#1a2e3f] backdrop-blur-xl transition-shadow ${showShadow ? "shadow-[0_14px_24px_-20px_rgba(20,45,65,0.55)]" : "shadow-none"}`}>
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 px-5 py-3">
                <Link href="/" className="public-hero-title whitespace-nowrap text-[1.55rem] leading-none font-bold tracking-tight text-[#163042] transition-colors hover:text-[#b86d3a]">
                    {name}
                </Link>

                <nav className="hidden md:flex items-center gap-1 text-[15px] font-semibold">
                    {menuItems.map((item) =>
                        item.children ? (
                            <div key={item.label} className="relative group">
                                <button
                                    className={`flex items-center gap-1 rounded-full px-3 py-2 transition-all ${
                                        item.children.some((child) => isActive(child.href))
                                            ? "bg-[#eef3f6] text-[#b86d3a]"
                                            : "text-[#1e3a4f] hover:bg-[#eef3f6] hover:text-[#b86d3a]"
                                    }`}
                                >
                                    {item.label}
                                    <ChevronDown size={16} />
                                </button>

                                <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-white/70 bg-white/95 text-[#1f2f3d] shadow-2xl py-2 opacity-0 invisible translate-y-1 transition-all duration-150 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0">
                                    {item.children.map((child) => (
                                        <Link
                                            key={child.label}
                                            href={child.href}
                                            className={`block px-4 py-2 text-base transition-colors ${
                                                isActive(child.href)
                                                    ? "bg-[#ebf1f4] text-[#183244] font-semibold"
                                                    : "hover:bg-[#f4f7f8] hover:text-[#b86d3a]"
                                            }`}
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
                                    className={`rounded-full px-3 py-2 transition-all ${
                                    isActive(item.href)
                                        ? "bg-[#eef3f6] text-[#b86d3a]"
                                        : "text-[#1e3a4f] hover:bg-[#eef3f6] hover:text-[#b86d3a]"
                                }`}
                            >
                                {item.label}
                            </Link>
                        )
                    )}
                </nav>

                <button
                    className="md:hidden rounded-xl border border-[#d4e1e7] bg-white/80 p-2 text-[#17384d] transition-colors hover:bg-white"
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

            {mobileOpen && (
                <div className="md:hidden border-t border-white/70 bg-[#eef3f5]/95 px-4 pb-4">
                    {menuItems.map((item) =>
                        item.children ? (
                            <div key={item.label} className="mt-2">
                                <button
                                    className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
                                        item.children.some((child) => isActive(child.href))
                                            ? "bg-[#eef3f6] text-[#b86d3a]"
                                            : "text-[#1e3a4f] hover:bg-white/80"
                                    }`}
                                    onClick={() => setMobileMoreOpen(!mobileMoreOpen)}
                                    aria-expanded={mobileMoreOpen}
                                >
                                    <span>{item.label}</span>
                                    <ChevronDown size={16} className={mobileMoreOpen ? "rotate-180 transition-transform" : "transition-transform"} />
                                </button>
                                {mobileMoreOpen && (
                                    <div className="mt-1 pl-3 space-y-1">
                                        {item.children.map((child) => (
                                            <Link
                                                key={child.label}
                                                href={child.href}
                                                onClick={() => {
                                                        setMobileOpen(false);
                                                        setMobileMoreOpen(false);
                                                    }}
                                                className={`block rounded-lg px-2 py-1 text-sm transition-colors ${
                                                    isActive(child.href)
                                                        ? "bg-[#dbe8ee] font-semibold text-[#183244]"
                                                        : "text-[#3d5566] hover:bg-white/80 hover:text-[#b86d3a]"
                                                }`}
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
                                className={`block mt-2 rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
                                    isActive(item.href)
                                        ? "bg-[#eef3f6] text-[#b86d3a]"
                                        : "text-[#1e3a4f] hover:bg-white/80 hover:text-[#b86d3a]"
                                }`}
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
