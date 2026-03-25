type TruncatedTooltipTextProps = {
  text: string;
  maxLength?: number;
  align?: "left" | "center" | "right";
  className?: string;
};

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1)}…`;
};

const TruncatedTooltipText = ({
  text,
  maxLength = 20,
  align = "left",
  className = "",
}: TruncatedTooltipTextProps) => {
  const trimmed = text.trim();
  const truncated = truncateText(trimmed, maxLength);
  const isTruncated = truncated !== trimmed;
  const alignmentClass =
    align === "right"
      ? "right-0 after:right-4"
      : align === "center"
        ? "left-1/2 -translate-x-1/2 after:left-1/2 after:-translate-x-1/2"
      : "left-0 after:left-4";

  if (!trimmed) return null;

  if (!isTruncated) {
    return <span className={className}>{trimmed}</span>;
  }

  return (
    <span className={`group/tooltip relative inline-flex max-w-full ${className}`}>
      <span className="cursor-help underline decoration-[#caa988]/50 decoration-dotted underline-offset-4">
        {truncated}
      </span>
      <span
        role="tooltip"
        className={`pointer-events-none absolute bottom-[calc(100%+32px)] z-20 w-max max-w-[280px] rounded-xl border border-white/15 bg-[#17323D]/95 px-3 py-2 text-[11px] leading-relaxed text-white opacity-0 shadow-2xl backdrop-blur-sm transition duration-200 group-hover/tooltip:-translate-y-1 group-hover/tooltip:opacity-100 group-focus-within/tooltip:-translate-y-1 group-focus-within/tooltip:opacity-100 ${alignmentClass} after:absolute after:top-full after:block after:h-0 after:w-0 after:border-l-[6px] after:border-r-[6px] after:border-t-[7px] after:border-l-transparent after:border-r-transparent after:border-t-[#17323D]/95 after:content-['']`}
      >
        {trimmed}
      </span>
    </span>
  );
};

export default TruncatedTooltipText;
