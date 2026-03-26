import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Footer } from "./components/Footer";
import { HexTracker } from "./components/HexTracker";
import { NavBar } from "./components/NavBar";
import { StatCards } from "./components/StatCards";
import {
  useCreateStat,
  useDeleteStat,
  useGetStats,
  useUpdateStat,
} from "./hooks/useQueries";

const queryClient = new QueryClient();

const FEATURES = [
  {
    icon: "⬡",
    title: "6 Corner Stats",
    desc: "Map any metric you care about to the 6 vertices of your personal hex.",
    color: "oklch(0.88 0.15 200)",
  },
  {
    icon: "◈",
    title: "Live Radar Chart",
    desc: "Your filled shape morphs instantly as you update values — see your balance at a glance.",
    color: "oklch(0.55 0.25 280)",
  },
  {
    icon: "▲",
    title: "Track Progress",
    desc: "Persist your stats on-chain. Every update is timestamped and stored permanently.",
    color: "oklch(0.88 0.18 165)",
  },
];

function AppInner() {
  const { data: stats = [], isLoading } = useGetStats();
  const createStat = useCreateStat();
  const updateStat = useUpdateStat();
  const deleteStat = useDeleteStat();

  async function handleSave(
    _index: number,
    name: string,
    value: number,
    existingId?: bigint,
  ) {
    if (!name.trim()) return;
    try {
      if (existingId !== undefined) {
        await updateStat.mutateAsync({
          id: existingId,
          name: name.trim(),
          value: BigInt(value),
        });
        toast.success(`${name} updated!`);
      } else {
        await createStat.mutateAsync({
          name: name.trim(),
          value: BigInt(value),
        });
        toast.success(`${name} added!`);
      }
    } catch {
      toast.error("Failed to save stat");
    }
  }

  async function handleDelete(id: bigint) {
    try {
      await deleteStat.mutateAsync(id);
      toast.success("Stat removed");
    } catch {
      toast.error("Failed to delete stat");
    }
  }

  const isMutating =
    createStat.isPending || updateStat.isPending || deleteStat.isPending;

  return (
    <div
      className="min-h-screen hex-bg"
      style={{ background: "oklch(0.09 0.022 245)" }}
    >
      <NavBar />

      <main>
        {/* Hero */}
        <section className="container mx-auto px-6 pt-14 pb-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <span
              className="inline-block text-xs font-semibold tracking-widest uppercase mb-4 px-4 py-1.5 rounded-full border"
              style={{
                color: "oklch(0.88 0.15 200)",
                borderColor: "oklch(0.88 0.15 200 / 0.3)",
                background: "oklch(0.88 0.15 200 / 0.08)",
              }}
            >
              Hexagonal Stats Tracker
            </span>
            <h1
              className="font-display font-extrabold text-5xl md:text-6xl leading-tight mb-5"
              style={{ color: "oklch(0.93 0.01 250)" }}
            >
              Visualize Your Vital Stats{" "}
              <span
                className="text-glow-cyan"
                style={{ color: "oklch(0.88 0.15 200)" }}
              >
                like Never Before.
              </span>
            </h1>
            <p
              className="text-lg max-w-2xl mx-auto leading-relaxed"
              style={{ color: "oklch(0.67 0.03 230)" }}
            >
              Your customizable hexagonal tracker maps 6 life dimensions across
              the corners of your personal hexagon. Click any node to set a stat
              you want to improve — watch your shape transform in real time.
            </p>
          </motion.div>
        </section>

        {/* Hex Tracker */}
        <section
          data-ocid="hex.section"
          className="container mx-auto px-6 flex justify-center relative"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="animate-float"
          >
            <HexTracker
              stats={stats}
              onSave={handleSave}
              onDelete={handleDelete}
              isLoading={isLoading || isMutating}
            />
          </motion.div>
        </section>

        {/* Instruction hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-center text-sm mt-4 mb-10"
          style={{ color: "oklch(0.5 0.03 230)" }}
        >
          Click any corner node to add or edit a stat
        </motion.p>

        {/* Stat Cards */}
        <section
          data-ocid="stats.section"
          className="container mx-auto px-6 pb-12"
        >
          <h2
            className="text-center text-sm font-semibold uppercase tracking-widest mb-6"
            style={{ color: "oklch(0.55 0.03 230)" }}
          >
            Your Stats Overview
          </h2>
          <StatCards stats={stats} />
        </section>

        {/* Features row */}
        <section className="container mx-auto px-6 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                data-ocid={`features.card.${i + 1}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="rounded-xl border p-6"
                style={{
                  background: "oklch(0.13 0.03 248)",
                  borderColor: f.color.replace(")", " / 0.2)"),
                }}
              >
                <div
                  className="text-3xl mb-3"
                  style={{
                    color: f.color,
                    filter: `drop-shadow(0 0 8px ${f.color})`,
                  }}
                >
                  {f.icon}
                </div>
                <h3
                  className="font-display font-bold text-base mb-2"
                  style={{ color: f.color }}
                >
                  {f.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "oklch(0.67 0.03 230)" }}
                >
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppInner />
    </QueryClientProvider>
  );
}
