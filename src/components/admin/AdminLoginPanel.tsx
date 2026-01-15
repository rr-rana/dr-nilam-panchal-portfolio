"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";

type AdminLoginPanelProps = {
  title?: string;
  subtitle: string;
  username: string;
  password: string;
  error?: string;
  onUsernameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: FormEvent) => void;
};

type PublicContent = {
  sidebarName?: string;
  profileImageUrl?: string;
};

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 17) return "Good afternoon";
  if (hour >= 17 && hour < 22) return "Good evening";
  return "Welcome";
};

const AdminLoginPanel = ({
  title = "Admin Login",
  subtitle,
  username,
  password,
  error,
  onUsernameChange,
  onPasswordChange,
  onSubmit,
}: AdminLoginPanelProps) => {
  const [profile, setProfile] = useState<PublicContent>({});

  useEffect(() => {
    const load = async () => {
      const response = await fetch("/api/content", { cache: "no-store" });
      if (!response.ok) return;
      const data = (await response.json()) as PublicContent;
      setProfile(data || {});
    };

    load();
  }, []);

  const greeting = useMemo(() => getGreeting(), []);
  const name = profile.sidebarName || "Admin";
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-[70vh] bg-[radial-gradient(circle_at_top,#f6f1e7_0%,#f3ede1_35%,#ebe4d6_65%,#e2d9c7_100%)]">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="grid items-stretch md:grid-cols-[1fr_1.1fr]">
          <div className="hidden rounded-l-3xl border border-white/70 bg-white/90 p-8 shadow-xl md:flex md:flex-col md:items-center md:justify-center md:text-center">
            {profile.profileImageUrl && (
              <div className="relative h-56 w-56 overflow-hidden rounded-3xl border-4 border-white shadow-lg">
                <Image
                  src={profile.profileImageUrl}
                  alt="Profile"
                  fill
                  quality={100}
                  priority
                  className="object-cover"
                />
              </div>
            )}
            <div className="pt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7A4C2C]">
                {greeting}
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-[#17323D]">
                {name}
              </h2>
            </div>
          </div>

          <div className="rounded-3xl border border-white/70 bg-white/90 p-8 shadow-xl backdrop-blur md:rounded-l-none">
            <h1 className="mt-3 text-2xl font-semibold text-[#17323D]">
              {title}
            </h1>
            <p className="mt-2 text-sm text-[#4c5f66]">{subtitle}</p>
            {error && (
              <div className="mt-4 rounded-2xl bg-red-50 px-4 py-2 text-xs text-red-700">
                {error}
              </div>
            )}
            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <input
                type="text"
                value={username}
                onChange={(event) => onUsernameChange(event.target.value)}
                placeholder="Username"
                required
                className="w-full rounded-2xl border border-[#e1d6c6] bg-white px-4 py-3 text-sm text-[#2d3b41] outline-none focus:border-[#17323D] focus:ring-2 focus:ring-[#17323D]/10"
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => onPasswordChange(event.target.value)}
                  placeholder="Password"
                  required
                  className="w-full rounded-2xl border border-[#e1d6c6] bg-white px-4 py-3 pr-12 text-sm text-[#2d3b41] outline-none focus:border-[#17323D] focus:ring-2 focus:ring-[#17323D]/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-[#7A4C2C]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <button
                type="submit"
                className="w-full cursor-pointer rounded-full bg-[#17323D] py-2 text-sm font-semibold text-white"
              >
                Sign in
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPanel;
