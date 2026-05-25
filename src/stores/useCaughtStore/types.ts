export type EncounterZone = "land" | "water" | "fishing";

export type CaughtEncounterStatus =
  | "unavailable"
  | "dormant"
  | "loading"
  | "ready";

export type CaughtEncounterInput = {
  levelId: string;
  zone: EncounterZone;
  speciesId: number;
};

export type CaughtEncounterRecord = CaughtEncounterInput & {
  key: string;
};

export type CaughtEncounterState = {
  status: CaughtEncounterStatus;
  caughtKeys: Set<string>;
};

export type CaughtEncounterActions = {
  beginLazyLoad: () => Promise<void>;
  hasCaughtRecords: () => Promise<boolean>;
  toggleCaught: (input: CaughtEncounterInput) => void;
  clearCaught: () => Promise<void>;
};

export type CaughtEncounterStore = CaughtEncounterState &
  CaughtEncounterActions;

export type PendingCaughtWrite = CaughtEncounterRecord | null;
