type AdminToastProps = {
  message: string;
  variant?: "success" | "error";
};

const AdminToast = ({ message, variant = "success" }: AdminToastProps) => {
  if (!message) return null;

  const baseClass =
    "fixed bottom-6 right-6 z-50 rounded-full px-4 py-2 text-xs font-semibold shadow-lg";
  const variantClass =
    variant === "error"
      ? "bg-red-600 text-white"
      : "bg-[#17323D] text-white";

  return <div className={`${baseClass} ${variantClass}`}>{message}</div>;
};

export default AdminToast;
