import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  "Dashboard",
  "Metrics",
  "Goals",
  "Journal",
  "Settings",
  "Profile",
];

export function NavBar() {
  return (
    <header
      className="sticky top-0 z-50 w-full border-b"
      style={{
        background: "oklch(0.11 0.03 248 / 0.9)",
        borderColor: "oklch(0.22 0.04 248)",
        backdropFilter: "blur(20px)",
      }}
    >
      <div className="container mx-auto flex h-14 items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center gap-2" data-ocid="nav.link">
          <div
            className="relative flex items-center justify-center w-8 h-8"
            style={{
              filter: "drop-shadow(0 0 8px oklch(0.88 0.15 200 / 0.8))",
            }}
          >
            <svg
              viewBox="0 0 32 32"
              width="32"
              height="32"
              role="img"
              aria-label="STATSgO icon"
            >
              <title>STATSgO icon</title>
              <polygon
                points="16,2 30,9 30,23 16,30 2,23 2,9"
                fill="oklch(0.88 0.15 200 / 0.15)"
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
          </div>
          <span
            className="font-display font-extrabold text-lg tracking-tight"
            style={{ color: "oklch(0.93 0.01 250)" }}
          >
            STATS<span style={{ color: "oklch(0.88 0.15 200)" }}>gO</span>
          </span>
        </div>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link, i) => (
            <button
              key={link}
              type="button"
              data-ocid="nav.link"
              className="text-sm font-medium transition-colors hover:text-foreground cursor-pointer bg-transparent border-0"
              style={{
                color:
                  i === 0 ? "oklch(0.88 0.15 200)" : "oklch(0.67 0.03 230)",
                borderBottom:
                  i === 0 ? "1.5px solid oklch(0.88 0.15 200)" : "none",
                paddingBottom: i === 0 ? "2px" : undefined,
              }}
            >
              {link}
            </button>
          ))}
        </nav>

        {/* Login */}
        <Button
          data-ocid="nav.primary_button"
          size="sm"
          className="rounded-full px-5 text-sm font-semibold"
          style={{
            background: "oklch(0.17 0.04 248)",
            color: "oklch(0.93 0.01 250)",
            border: "1px solid oklch(0.25 0.05 248)",
          }}
        >
          Log In / Sign Up
        </Button>
      </div>
    </header>
  );
}
