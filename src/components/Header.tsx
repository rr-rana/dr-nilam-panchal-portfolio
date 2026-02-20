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
  const name = displayName || "Prof. (Dr.) Nilam Panchal";
  const pathname = usePathname() || "";
  const isAdmin = /^\/admin(?:\/|$)/.test(pathname);

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
      <header className="fixed top-0 left-0 z-50 w-full border-b border-white/10 bg-linear-to-r from-[#0F2B3A] via-[#103547] to-[#0F2B3A] text-[#F6F1E7] shadow-lg">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link
            href="/"
            className="text-xl font-semibold tracking-wide text-[#F6F1E7] hover:text-white transition-colors"
          >
            {name}
          </Link>
        </div>
      </header>
    );
  }

  return (
    <header className="fixed top-0 left-0 z-50 w-full border-b border-[#d4deea]/70 bg-[#f6f9fd]/90 text-[#152536] backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5">
        <Link
          href="/"
          className="max-w-[220px] truncate text-sm font-semibold tracking-[0.04em] text-[#17324a] sm:max-w-none sm:text-base"
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
                      ? "bg-[#dce8f8] text-[#17324a]"
                      : "text-[#41566c] hover:bg-[#e9f0f9] hover:text-[#17324a]"
                  }`}
                >
                  {item.label}
                  <ChevronDown size={14} />
                </button>
                <div className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-[#d4deea] bg-white py-2 text-[#223548] shadow-xl opacity-0 invisible translate-y-1 transition-all duration-150 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0">
                  {item.children.map((child) => (
                    <Link
                      key={child.label}
                      href={child.href}
                      className={`block px-4 py-2 transition-colors ${
                        isActive(child.href)
                          ? "bg-[#edf3fb] font-semibold text-[#17324a]"
                          : "hover:bg-[#f4f8fd]"
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
                    ? "bg-[#dce8f8] text-[#17324a]"
                    : "text-[#41566c] hover:bg-[#e9f0f9] hover:text-[#17324a]"
                }`}
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        <button
          className="md:hidden rounded-md p-1 text-[#17324a] hover:bg-[#e9f0f9]"
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
        <div className="md:hidden border-t border-[#d4deea] bg-white/95 px-4 pb-4">
          {menuItems.map((item) =>
            item.children ? (
              <div key={item.label} className="mt-2">
                <button
                  className="flex w-full items-center justify-between py-2 font-semibold text-[#223548]"
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
                            ? "bg-[#edf3fb] font-semibold text-[#17324a]"
                            : "text-[#41566c]"
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
                className={`mt-2 block rounded-md px-2 py-1 ${
                  isActive(item.href)
                    ? "bg-[#edf3fb] font-semibold text-[#17324a]"
                    : "text-[#41566c]"
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
