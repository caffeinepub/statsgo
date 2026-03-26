export function Footer() {
  const year = new Date().getFullYear();
  const utm = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;

  return (
    <footer
      className="w-full border-t mt-16 py-8"
      style={{
        background: "oklch(0.11 0.03 248)",
        borderColor: "oklch(0.22 0.04 248)",
      }}
    >
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <svg
            viewBox="0 0 32 32"
            width="24"
            height="24"
            role="img"
            aria-label="STATSgO logo"
            style={{
              filter: "drop-shadow(0 0 6px oklch(0.88 0.15 200 / 0.6))",
            }}
          >
            <title>STATSgO logo</title>
            <polygon
              points="16,2 30,9 30,23 16,30 2,23 2,9"
              fill="oklch(0.88 0.15 200 / 0.1)"
              stroke="oklch(0.88 0.15 200)"
              strokeWidth="1.5"
            />
            <text
              x="16"
              y="21"
              textAnchor="middle"
              fill="oklch(0.88 0.15 200)"
              fontSize="14"
              fontWeight="800"
              fontFamily="'Bricolage Grotesque', sans-serif"
            >
              S
            </text>
          </svg>
          <span
            className="font-display font-bold text-sm"
            style={{ color: "oklch(0.67 0.03 230)" }}
          >
            STATSgO — Track Your Vital Stats
          </span>
        </div>

        <div
          className="flex gap-6 text-xs"
          style={{ color: "oklch(0.5 0.03 230)" }}
        >
          <button
            type="button"
            className="hover:text-foreground transition-colors"
          >
            Privacy
          </button>
          <button
            type="button"
            className="hover:text-foreground transition-colors"
          >
            Terms
          </button>
          <button
            type="button"
            className="hover:text-foreground transition-colors"
          >
            Support
          </button>
        </div>

        <p className="text-xs" style={{ color: "oklch(0.45 0.03 230)" }}>
          © {year}. Built with ❤️ using{" "}
          <a
            href={utm}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
            style={{ color: "oklch(0.88 0.15 200)" }}
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </footer>
  );
}
