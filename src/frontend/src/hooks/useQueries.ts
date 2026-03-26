import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Stat } from "../backend.d";
import { useActor } from "./useActor";

export type { Stat };

export function useGetStats() {
  const { actor, isFetching } = useActor();
  return useQuery<Stat[]>({
    queryKey: ["stats"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getStatsSortedByTimestamp();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateStat() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ name, value }: { name: string; value: bigint }) => {
      if (!actor) throw new Error("No actor");
      return actor.createStat(name, value);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["stats"] }),
  });
}

export function useUpdateStat() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      name,
      value,
    }: {
      id: bigint;
      name: string | null;
      value: bigint | null;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateStat(id, name, value);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["stats"] }),
  });
}

export function useDeleteStat() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteStat(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["stats"] }),
  });
}
