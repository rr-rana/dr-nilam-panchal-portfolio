"use client";

import { usePathname } from "next/navigation";

const Footer = () => {
  const pathname = usePathname();
  const privacyHref = pathname?.startsWith("/admin")
    ? "/admin/privacy"
    : "/privacy";
  return (
    <footer>
      <div className="bg-[#0f2c3c]">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-sm text-white/80">
          © {new Date().getFullYear()} Prof. (Dr.) Nilam Panchal ·{" "}
          <a className="underline underline-offset-4" href={privacyHref}>
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
