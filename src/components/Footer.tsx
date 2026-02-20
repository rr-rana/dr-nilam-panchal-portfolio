"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const Footer = () => {
  const pathname = usePathname() || "";
  const isAdmin = pathname.startsWith("/admin");
  const privacyHref = isAdmin ? "/admin/privacy" : "/privacy";
  const year = useMemo(() => new Date().getFullYear(), []);

  if (isAdmin) {
    return (
      <footer>
        <div className="bg-[#0f2c3c]">
          <div className="max-w-6xl mx-auto px-4 py-6 text-center text-sm text-white/80">
            © {year} Prof. (Dr.) Nilam Panchal ·{" "}
            <Link className="underline underline-offset-4" href={privacyHref}>
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="border-t border-[#cfdbe3] bg-[#f4f8fa]">
      <div className="mx-auto max-w-6xl px-4 py-5 flex flex-col gap-2 text-sm text-[#556473] sm:flex-row sm:items-center sm:justify-between">
        <p>© {year} Dr. Nilam Panchal. All rights reserved.</p>
        <Link className="font-semibold text-[#0f5c58] hover:underline" href={privacyHref}>
          Privacy Policy
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
