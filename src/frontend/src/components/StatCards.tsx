import { motion } from "motion/react";
import type { Stat } from "../hooks/useQueries";

const COLORS = [
  "oklch(0.88 0.15 200)",
  "oklch(0.88 0.18 165)",
  "oklch(0.55 0.25 280)",
  "oklch(0.88 0.15 200)",
  "oklch(0.88 0.18 165)",
  "oklch(0.55 0.25 280)",
];

const DEFAULT_NAMES = [
  "Health",
  "Energy",
  "Learning",
  "Fitness",
  "Productivity",
  "Social",
];
const DEFAULT_VALUES = [78, 65, 82, 91, 88, 60];

function Sparkline({ value, color }: { value: number; color: string }) {
  const pts = [0, 20, 10, 35, 25, 15, 40, value * 0.4, 55, value * 0.4 - 5];
  const points = pts
    .reduce<string[]>((acc, v, i) => {
      if (i % 2 === 0) acc.push(`${v},`);
      else acc[acc.length - 1] += `${40 - v}`;
      return acc;
    }, [])
    .join(" ");

  return (
    <svg
      width="60"
      height="24"
      viewBox="0 0 60 40"
      role="img"
      aria-label="sparkline"
    >
      <title>Sparkline trend</title>
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ filter: `drop-shadow(0 0 3px ${color})` }}
      />
    </svg>
  );
}

interface StatCardsProps {
  stats: Stat[];
}

export function StatCards({ stats }: StatCardsProps) {
  const cards = Array.from({ length: 6 }, (_, i) => {
    const s = stats[i];
    return {
      key: s ? `stat-${s.id}` : `empty-${i}`,
      name: s ? s.name : DEFAULT_NAMES[i],
      value: s ? Number(s.value) : DEFAULT_VALUES[i],
      isEmpty: !s,
    };
  });

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 w-full max-w-4xl mx-auto">
      {cards.map((card, i) => {
        const color = COLORS[i];
        return (
          <motion.div
            key={card.key}
            data-ocid={`stats.card.${i + 1}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.4 }}
            className="rounded-xl p-4 border relative overflow-hidden"
            style={{
              background: "oklch(0.13 0.03 248)",
              borderColor: card.isEmpty
                ? "oklch(0.22 0.04 248)"
                : color.replace(")", " / 0.3)"),
              opacity: card.isEmpty ? 0.5 : 1,
            }}
          >
            {!card.isEmpty && (
              <div
                className="absolute top-0 left-0 right-0 h-0.5"
                style={{ background: color, filter: "blur(4px)", opacity: 0.8 }}
              />
            )}

            <div
              className="text-xs font-semibold mb-1"
              style={{ color: card.isEmpty ? "oklch(0.4 0.03 230)" : color }}
            >
              {card.name}
            </div>
            <div
              className="text-2xl font-extrabold font-display"
              style={{
                color: card.isEmpty ? "oklch(0.4 0.03 230)" : color,
                filter: card.isEmpty ? "none" : `drop-shadow(0 0 6px ${color})`,
              }}
            >
              {card.value}
              <span className="text-sm">%</span>
            </div>
            <div className="mt-2">
              <Sparkline
                value={card.value}
                color={card.isEmpty ? "oklch(0.3 0.03 230)" : color}
              />
            </div>
            <div className="mt-1">
              <div className="h-1 rounded-full bg-border overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: color,
                    filter: `drop-shadow(0 0 4px ${color})`,
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${card.value}%` }}
                  transition={{
                    delay: i * 0.06 + 0.3,
                    duration: 0.8,
                    ease: "easeOut",
                  }}
                />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
