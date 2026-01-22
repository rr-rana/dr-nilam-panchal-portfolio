import AdminLoginClient from "@/app/admin/login/AdminLoginClient";
import { headers } from "next/headers";

type PublicContent = {
  sidebarName?: string;
  profileImageUrl?: string;
};

const AdminLoginPage = async () => {
  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") ?? "http";
  const baseUrl = host ? `${protocol}://${host}` : "";
  const response = await fetch(
    `${baseUrl}/api/content/public`,
    { next: { revalidate: 300 } }
  );
  const profile = response.ok ? ((await response.json()) as PublicContent) : {};

  return <AdminLoginClient profile={profile} />;
};

export default AdminLoginPage;
