"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const Footer = () => {
  const pathname = usePathname();
  const effectivePathname = pathname || "";
  const isAdmin = effectivePathname?.startsWith("/admin");
  const privacyHref = effectivePathname?.startsWith("/admin")
    ? "/admin/privacy"
    : "/privacy";
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
    <footer>
      <div className="border-t border-white/55 bg-[#edf3f5]/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-sm text-[#405464]">
          © {year} Prof. (Dr.) Nilam Panchal ·{" "}
          <Link className="font-semibold text-[#17384d] underline underline-offset-4" href={privacyHref}>
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
