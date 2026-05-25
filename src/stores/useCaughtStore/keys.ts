import type { CaughtEncounterInput } from "./types";

export function makeCaughtEncounterKey({
  levelId,
  zone,
  speciesId,
}: CaughtEncounterInput): string {
  return `${levelId}:${zone}:${speciesId}`;
}
