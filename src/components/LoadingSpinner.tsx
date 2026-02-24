const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center gap-3">
      <div className="relative h-10 w-10">
        <div className="absolute inset-0 rounded-full border-2 border-[#d5e2ea]" />
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-[#17323D] border-t-transparent" />
      </div>
      <div className="text-sm font-semibold text-[#17323D]">Loading...</div>
    </div>
  );
};

export default LoadingSpinner;
