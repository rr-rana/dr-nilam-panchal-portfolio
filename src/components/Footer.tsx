"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const Footer = () => {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const effectivePathname = isMounted ? pathname : "";
  const privacyHref = effectivePathname?.startsWith("/admin")
    ? "/admin/privacy"
    : "/privacy";
  const year = useMemo(() => new Date().getFullYear(), []);
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
};

export default Footer;
