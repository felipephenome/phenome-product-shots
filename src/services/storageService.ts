import { get, set, del, keys } from "idb-keyval";
import type { Generation } from "@/types";

const PREFIX = "phenome-stash-";

export async function saveGeneration(gen: Generation): Promise<void> {
  await set(`${PREFIX}${gen.id}`, gen);
}

export async function loadGenerations(): Promise<Generation[]> {
  const allKeys = await keys();
  const genKeys = allKeys.filter(
    (k) => typeof k === "string" && k.startsWith(PREFIX)
  );
  const results: Generation[] = [];
  for (const k of genKeys) {
    const val = await get<Generation>(k);
    if (val) results.push(val);
  }
  results.sort((a, b) => b.timestamp - a.timestamp);
  return results;
}

export async function deleteGeneration(id: string): Promise<void> {
  await del(`${PREFIX}${id}`);
}

export async function clearAllGenerations(): Promise<void> {
  const allKeys = await keys();
  for (const k of allKeys) {
    if (typeof k === "string" && k.startsWith(PREFIX)) {
      await del(k);
    }
  }
}
