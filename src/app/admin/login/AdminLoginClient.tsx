"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import AdminLoginPanel from "@/components/admin/AdminLoginPanel";
import { useAdminSession } from "@/components/admin/AdminSessionProvider";

type PublicContent = {
  sidebarName?: string;
  profileImageUrl?: string;
};

const AdminLoginClient = ({ profile }: { profile: PublicContent }) => {
  const router = useRouter();
  const { refreshSession } = useAdminSession();
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      setError(payload.error || "Login failed.");
      setIsSubmitting(false);
      return;
    }

    await refreshSession({ showLoader: true });
    router.replace("/admin");
  };

  return (
    <AdminLoginPanel
      subtitle="Use your admin credentials to edit the website content."
      username={username}
      password={password}
      error={error}
      isSubmitting={isSubmitting}
      profile={profile}
      onUsernameChange={setUsername}
      onPasswordChange={setPassword}
      onSubmit={handleLogin}
    />
  );
};

export default AdminLoginClient;
