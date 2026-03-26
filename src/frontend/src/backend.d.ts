import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Stat {
    id: bigint;
    value: bigint;
    name: string;
    timestamp: bigint;
}
export interface backendInterface {
    createStat(name: string, value: bigint): Promise<bigint>;
    deleteStat(id: bigint): Promise<void>;
    getStats(): Promise<Array<Stat>>;
    getStatsSortedByTimestamp(): Promise<Array<Stat>>;
    updateStat(id: bigint, newName: string | null, newValue: bigint | null): Promise<void>;
}
