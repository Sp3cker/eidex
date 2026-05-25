import { describe, expect, it } from "vitest";
import { encounterStore } from "@/data/map/encounters";
import type { EncounterZone } from "@/stores/caughtEncounterStore";

type EncounterMon = {
  species: number;
};

type EncounterBlock = {
  mons?: EncounterMon[];
};

type EncounterLevel = {
  map: string;
  land?: EncounterBlock;
  water?: EncounterBlock;
  fish?: EncounterBlock;
};

describe("encounter zone uniqueness", () => {
  it("documents species that appear in multiple zones per encounter level", () => {
    const duplicateReports: string[] = [];
    const encounterLevels = Object.values(encounterStore.getEncounterData()).flat();

    for (const encounterLevel of encounterLevels as EncounterLevel[]) {
      const zonesBySpecies = new Map<number, Set<EncounterZone>>();
      const addZone = (mons: EncounterMon[] | undefined, zone: EncounterZone) => {
        for (const mon of mons ?? []) {
          const zones = zonesBySpecies.get(mon.species) ?? new Set<EncounterZone>();
          zones.add(zone);
          zonesBySpecies.set(mon.species, zones);
        }
      };

      addZone(encounterLevel.land?.mons, "land");
      addZone(encounterLevel.water?.mons, "water");
      addZone(encounterLevel.fish?.mons, "fishing");

      for (const [species, zones] of zonesBySpecies) {
        if (zones.size > 1) {
          duplicateReports.push(
            `${encounterLevel.map}:${species}:${[...zones].join(",")}`,
          );
        }
      }
    }

    expect(duplicateReports).toEqual([
      "MAP_ABANDONED_SHIP_ROOMS_B1F:88:water,fishing",
      "MAP_ABANDONED_SHIP_ROOMS_B1F:690:water,fishing",
      "MAP_ABANDONED_SHIP_ROOMS_B1F:72:water,fishing",
      "MAP_ABANDONED_SHIP_ROOMS_B1F:691:water,fishing",
      "MAP_ABANDONED_SHIP_ROOMS_B1F:73:water,fishing",
      "MAP_ABANDONED_SHIP_HIDDEN_FLOOR_CORRIDORS:88:water,fishing",
      "MAP_ABANDONED_SHIP_HIDDEN_FLOOR_CORRIDORS:690:water,fishing",
      "MAP_ABANDONED_SHIP_HIDDEN_FLOOR_CORRIDORS:72:water,fishing",
      "MAP_ABANDONED_SHIP_HIDDEN_FLOOR_CORRIDORS:691:water,fishing",
      "MAP_ABANDONED_SHIP_HIDDEN_FLOOR_CORRIDORS:73:water,fishing",
      "MAP_METEOR_FALLS_1F_2R:1350:land,water",
      "MAP_METEOR_FALLS_B1F_1R:1350:land,water",
      "MAP_ROUTE125:90:water,fishing",
      "MAP_ROUTE125:91:water,fishing",
      "MAP_SHOAL_CAVE_LOW_TIDE_INNER_ROOM:369:water,fishing",
      "MAP_SHOAL_CAVE_LOW_TIDE_ENTRANCE_ROOM:369:water,fishing",
      "MAP_EVER_GRANDE_CITY:690:water,fishing",
    ]);
  });
});
