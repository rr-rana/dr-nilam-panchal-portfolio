"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
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
  const pathname = usePathname() || "";
  const isAdmin = /^\/admin(?:\/|$)/.test(pathname);
  const name = displayName || "Prof. (Dr.) Nilam Panchal";

  const menuItems: MenuItem[] = useMemo(() => {
    const base = isAdmin ? "/admin" : "";
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
  }, [isAdmin]);

  const isActive = (href?: string) =>
    Boolean(href && (pathname === href || pathname.startsWith(`${href}/`)));

  if (isAdmin) {
    return (
      <header className="fixed top-0 left-0 w-full z-50 bg-linear-to-r from-[#0F2B3A] via-[#103547] to-[#0F2B3A] text-[#F6F1E7] shadow-lg border-b border-white/10">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-4">
          <Link href="/" className="text-xl font-semibold tracking-wide">
            {name}
          </Link>
        </div>
      </header>
    );
  }

  return (
    <header className="fixed top-0 left-0 z-50 w-full border-b border-[#cfdbe3] bg-[#f4f8fa]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5">
        <Link
          href="/"
          className="max-w-[210px] truncate text-base font-semibold tracking-[0.02em] text-[#153147] sm:max-w-none"
        >
          {name}
        </Link>

        <nav className="hidden md:flex items-center gap-2 text-sm font-semibold">
          {menuItems.map((item) =>
            item.children ? (
              <div key={item.label} className="relative group">
                <button
                  className={`flex cursor-pointer items-center gap-1 rounded-full px-3 py-1.5 transition-colors ${
                    item.children.some((child) => isActive(child.href))
                      ? "bg-[#dcf0ee] text-[#0f5c58]"
                      : "text-[#3d5162] hover:bg-[#e7f3f1] hover:text-[#134441]"
                  }`}
                >
                  {item.label}
                  <ChevronDown size={14} />
                </button>
                <div className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-[#cfdbe3] bg-white py-2 text-[#223548] shadow-xl opacity-0 invisible translate-y-1 transition-all duration-150 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0">
                  {item.children.map((child) => (
                    <Link
                      key={child.label}
                      href={child.href}
                      className={`block px-4 py-2 transition-colors ${
                        isActive(child.href)
                          ? "bg-[#edf8f7] font-semibold text-[#0f5c58]"
                          : "hover:bg-[#f3f8fb]"
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
                className={`rounded-full px-3 py-1.5 transition-colors ${
                  isActive(item.href)
                    ? "bg-[#dcf0ee] text-[#0f5c58]"
                    : "text-[#3d5162] hover:bg-[#e7f3f1] hover:text-[#134441]"
                }`}
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        <button
          className="md:hidden rounded-md p-1 text-[#153147] hover:bg-[#e6eef3]"
          onClick={() =>
            setMobileOpen((prev) => {
              const next = !prev;
              if (!next) setMobileMoreOpen(false);
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
        <div className="md:hidden border-t border-[#d4dde4] bg-white/95 px-4 pb-4">
          {menuItems.map((item) =>
            item.children ? (
              <div key={item.label} className="mt-2">
                <button
                  className="w-full flex items-center justify-between py-2 font-semibold text-[#23384c]"
                  onClick={() => setMobileMoreOpen((prev) => !prev)}
                  aria-expanded={mobileMoreOpen}
                >
                  <span>{item.label}</span>
                  <ChevronDown
                    size={16}
                    className={mobileMoreOpen ? "rotate-180 transition-transform" : "transition-transform"}
                  />
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
                        className={`block rounded-md px-2 py-1 text-sm ${
                          isActive(child.href)
                            ? "bg-[#edf8f7] font-semibold text-[#0f5c58]"
                            : "text-[#4a5d6e]"
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
                className={`block mt-2 rounded-md px-2 py-1 ${
                  isActive(item.href)
                    ? "bg-[#edf8f7] font-semibold text-[#0f5c58]"
                    : "text-[#4a5d6e]"
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
};

export default Header;
