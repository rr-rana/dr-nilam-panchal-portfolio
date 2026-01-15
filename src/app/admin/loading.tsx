import LoadingSpinner from "@/components/LoadingSpinner";

const Loading = () => {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#f6f1e7_0%,#f3ede1_35%,#ebe4d6_65%,#e2d9c7_100%)]">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4">
        <div className="rounded-3xl border border-white/70 bg-white/90 px-6 py-4 shadow-xl backdrop-blur">
          <LoadingSpinner />
        </div>
      </div>
    </div>
  );
};

export default Loading;
