import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Check, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { Stat } from "../hooks/useQueries";

const DEFAULT_STAT_NAMES = [
  "Health",
  "Energy",
  "Learning",
  "Fitness",
  "Productivity",
  "Social",
];

interface NodeStat {
  id?: bigint;
  name: string;
  value: number;
  isEmpty: boolean;
}

interface HexTrackerProps {
  stats: Stat[];
  onSave: (
    index: number,
    name: string,
    value: number,
    existingId?: bigint,
  ) => void;
  onDelete: (id: bigint) => void;
  isLoading?: boolean;
}

function getHexVertices(cx: number, cy: number, r: number): [number, number][] {
  return Array.from({ length: 6 }, (_, i) => {
    const angle = ((i * 60 - 90) * Math.PI) / 180;
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)] as [
      number,
      number,
    ];
  });
}

function getRadarPoints(
  cx: number,
  cy: number,
  r: number,
  values: number[],
): string {
  return values
    .map((v, i) => {
      const angle = ((i * 60 - 90) * Math.PI) / 180;
      const scale = Math.max(0.05, v / 100);
      return `${cx + r * scale * Math.cos(angle)},${cy + r * scale * Math.sin(angle)}`;
    })
    .join(" ");
}

const NODE_COLORS = [
  "oklch(0.88 0.15 200)",
  "oklch(0.88 0.18 165)",
  "oklch(0.55 0.25 280)",
  "oklch(0.88 0.15 200)",
  "oklch(0.88 0.18 165)",
  "oklch(0.55 0.25 280)",
];

export function HexTracker({
  stats,
  onSave,
  onDelete,
  isLoading,
}: HexTrackerProps) {
  const SIZE = 560;
  const CX = SIZE / 2;
  const CY = SIZE / 2;
  const HEX_R = 200;
  const NODE_R = 16;

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editValue, setEditValue] = useState(50);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const nodeStats: NodeStat[] = Array.from({ length: 6 }, (_, i) => {
    const stat = stats[i];
    if (stat) {
      return {
        id: stat.id,
        name: stat.name,
        value: Number(stat.value),
        isEmpty: false,
      };
    }
    return { name: DEFAULT_STAT_NAMES[i], value: 0, isEmpty: true };
  });

  const vertices = getHexVertices(CX, CY, HEX_R);
  const hexPoints = vertices.map(([x, y]) => `${x},${y}`).join(" ");
  const radarValues = nodeStats.map((n) => (n.isEmpty ? 0 : n.value));
  const radarPoints = getRadarPoints(CX, CY, HEX_R, radarValues);

  const innerRadii = [0.33, 0.66, 1.0];

  function openEdit(i: number) {
    const ns = nodeStats[i];
    setEditName(ns.isEmpty ? DEFAULT_STAT_NAMES[i] : ns.name);
    setEditValue(ns.isEmpty ? 50 : ns.value);
    setEditingIndex(i);
  }

  function closeEdit() {
    setEditingIndex(null);
  }

  function handleSave() {
    if (editingIndex === null) return;
    const ns = nodeStats[editingIndex];
    onSave(editingIndex, editName, editValue, ns.id);
    closeEdit();
  }

  function handleDelete() {
    if (editingIndex === null) return;
    const ns = nodeStats[editingIndex];
    if (ns.id !== undefined) onDelete(ns.id);
    closeEdit();
  }

  useEffect(() => {
    if (editingIndex !== null && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [editingIndex]);

  const LABEL_R = HEX_R + 56;
  const labelPositions = Array.from({ length: 6 }, (_, i) => {
    const angle = ((i * 60 - 90) * Math.PI) / 180;
    return [CX + LABEL_R * Math.cos(angle), CY + LABEL_R * Math.sin(angle)] as [
      number,
      number,
    ];
  });

  return (
    <div className="relative flex flex-col items-center">
      {isLoading && (
        <div
          data-ocid="hex.loading_state"
          className="absolute inset-0 flex items-center justify-center z-10 bg-background/70 rounded-full"
        >
          <div className="text-neon-cyan animate-pulse-glow text-sm font-medium">
            Loading stats...
          </div>
        </div>
      )}

      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="overflow-visible"
        style={{ maxWidth: "100%" }}
        role="img"
        aria-label="Hexagonal stats tracker"
      >
        <title>Hexagonal Stats Tracker</title>
        <defs>
          <radialGradient id="radarFill" cx="50%" cy="50%" r="50%">
            <stop
              offset="0%"
              stopColor="oklch(0.88 0.15 200)"
              stopOpacity="0.5"
            />
            <stop
              offset="100%"
              stopColor="oklch(0.55 0.25 280)"
              stopOpacity="0.15"
            />
          </radialGradient>
          <filter id="glowCyan" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter
            id="glowStrong"
            x="-100%"
            y="-100%"
            width="300%"
            height="300%"
          >
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="nodeGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {innerRadii.map((r) => (
          <polygon
            key={r}
            points={getHexVertices(CX, CY, HEX_R * r)
              .map(([x, y]) => `${x},${y}`)
              .join(" ")}
            fill="none"
            stroke="oklch(0.22 0.04 248 / 0.5)"
            strokeWidth="1"
          />
        ))}

        {vertices.map(([vx, vy]) => (
          <line
            key={`spoke-${vx.toFixed(0)}-${vy.toFixed(0)}`}
            x1={CX}
            y1={CY}
            x2={vx}
            y2={vy}
            stroke="oklch(0.22 0.04 248 / 0.5)"
            strokeWidth="1"
          />
        ))}

        <motion.polygon
          points={radarPoints}
          fill="url(#radarFill)"
          stroke="oklch(0.88 0.15 200)"
          strokeWidth="2"
          filter="url(#glowCyan)"
          animate={{ points: radarPoints }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
        />

        <polygon
          points={hexPoints}
          fill="none"
          stroke="oklch(0.88 0.15 200 / 0.2)"
          strokeWidth="12"
          filter="url(#glowStrong)"
        />

        <polygon
          points={hexPoints}
          fill="none"
          stroke="oklch(0.88 0.15 200)"
          strokeWidth="1.5"
          filter="url(#glowCyan)"
        />

        <text
          x={CX}
          y={CY - 8}
          textAnchor="middle"
          fill="oklch(0.67 0.03 230)"
          fontSize="11"
          fontFamily="'Plus Jakarta Sans', sans-serif"
        >
          My Weekly Focus
        </text>
        <text
          x={CX}
          y={CY + 8}
          textAnchor="middle"
          fill="oklch(0.67 0.03 230)"
          fontSize="10"
          fontFamily="'Plus Jakarta Sans', sans-serif"
        >
          {new Date().toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </text>

        {vertices.map(([vx, vy], i) => {
          const ns = nodeStats[i];
          const color = NODE_COLORS[i];
          const isActive = !ns.isEmpty;
          const [lx, ly] = labelPositions[i];
          const isEditing = editingIndex === i;

          return (
            <g key={ns.name}>
              <text
                x={lx}
                y={ly - 8}
                textAnchor="middle"
                fill={isActive ? color : "oklch(0.4 0.03 230)"}
                fontSize="12"
                fontWeight="600"
                fontFamily="'Plus Jakarta Sans', sans-serif"
                style={{
                  filter: isActive ? `drop-shadow(0 0 6px ${color})` : "none",
                }}
              >
                {ns.name}
              </text>
              {isActive && (
                <text
                  x={lx}
                  y={ly + 8}
                  textAnchor="middle"
                  fill={color}
                  fontSize="14"
                  fontWeight="700"
                  fontFamily="'Plus Jakarta Sans', sans-serif"
                  style={{ filter: `drop-shadow(0 0 4px ${color})` }}
                >
                  {ns.value}%
                </text>
              )}

              <circle
                cx={vx}
                cy={vy}
                r={NODE_R + 6}
                fill="none"
                stroke={color}
                strokeWidth="1"
                opacity={isActive ? 0.3 : 0.1}
                filter="url(#nodeGlow)"
              />

              <circle
                cx={vx}
                cy={vy}
                r={NODE_R}
                fill={
                  isActive
                    ? color.replace(")", " / 0.15)")
                    : "oklch(0.13 0.03 248)"
                }
                stroke={color}
                strokeWidth={isActive ? "2" : "1"}
                opacity={isActive ? 1 : 0.4}
                role="button"
                aria-label={`Edit ${ns.name}`}
                tabIndex={0}
                style={{
                  cursor: "pointer",
                  transition: "all 0.2s",
                  filter: isEditing
                    ? `drop-shadow(0 0 10px ${color})`
                    : undefined,
                }}
                onClick={() => openEdit(i)}
                onKeyDown={(e) =>
                  (e.key === "Enter" || e.key === " ") && openEdit(i)
                }
                data-ocid={`hex.node.${i + 1}`}
              />

              {!isActive && (
                <text
                  x={vx}
                  y={vy + 5}
                  textAnchor="middle"
                  fill={color}
                  fontSize="16"
                  opacity="0.5"
                  style={{
                    cursor: "pointer",
                    userSelect: "none",
                    pointerEvents: "none",
                  }}
                >
                  +
                </text>
              )}

              {isActive && (
                <text
                  x={vx}
                  y={vy + 5}
                  textAnchor="middle"
                  fill={color}
                  fontSize="10"
                  fontWeight="700"
                  style={{
                    cursor: "pointer",
                    userSelect: "none",
                    pointerEvents: "none",
                  }}
                >
                  {ns.value}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      <AnimatePresence>
        {editingIndex !== null &&
          (() => {
            const [vx, vy] = vertices[editingIndex];
            const isRight = vx > CX;
            const isBottom = vy > CY + 20;
            const color = NODE_COLORS[editingIndex];
            const popLeft = isRight
              ? `${(vx / SIZE) * 100 + 6}%`
              : `${(vx / SIZE) * 100 - 6}%`;
            const popTop = isBottom
              ? `${(vy / SIZE) * 100 + 4}%`
              : `${(vy / SIZE) * 100 - 4}%`;
            const nameId = `stat-name-${editingIndex}`;
            const valueId = `stat-value-${editingIndex}`;

            return (
              <motion.div
                key={editingIndex}
                data-ocid="hex.modal"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.15 }}
                className="absolute z-20 w-56 rounded-xl border p-4"
                style={{
                  left: popLeft,
                  top: popTop,
                  transform: `translate(${isRight ? "0" : "-100%"}, ${isBottom ? "0" : "-100%"})`,
                  background: "oklch(0.13 0.03 248 / 0.95)",
                  borderColor: color,
                  boxShadow: `0 0 20px ${color.replace(")", " / 0.3)")}`,
                  backdropFilter: "blur(12px)",
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold" style={{ color }}>
                    Edit Stat #{editingIndex + 1}
                  </span>
                  <button
                    type="button"
                    onClick={closeEdit}
                    data-ocid="hex.close_button"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label
                      htmlFor={nameId}
                      className="text-xs text-muted-foreground mb-1 block"
                    >
                      Stat Name
                    </label>
                    <Input
                      id={nameId}
                      ref={nameInputRef}
                      data-ocid="hex.input"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="e.g. Health"
                      className="h-8 text-sm bg-background/50 border-border"
                      onKeyDown={(e) => e.key === "Enter" && handleSave()}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor={valueId}
                      className="text-xs text-muted-foreground mb-1 block"
                    >
                      Value:{" "}
                      <span className="font-bold" style={{ color }}>
                        {editValue}%
                      </span>
                    </label>
                    <Slider
                      id={valueId}
                      data-ocid="hex.toggle"
                      value={[editValue]}
                      onValueChange={([v]) => setEditValue(v)}
                      min={0}
                      max={100}
                      step={1}
                      className="mt-1"
                    />
                  </div>

                  <div className="flex gap-2 pt-1">
                    <Button
                      size="sm"
                      data-ocid="hex.save_button"
                      onClick={handleSave}
                      className="flex-1 h-8 text-xs"
                      style={{
                        background: color,
                        color: "oklch(0.09 0.022 245)",
                        fontWeight: 700,
                      }}
                    >
                      <Check size={12} className="mr-1" /> Save
                    </Button>
                    {nodeStats[editingIndex]?.id !== undefined && (
                      <Button
                        size="sm"
                        variant="destructive"
                        data-ocid="hex.delete_button"
                        onClick={handleDelete}
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 size={12} />
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })()}
      </AnimatePresence>
    </div>
  );
}
