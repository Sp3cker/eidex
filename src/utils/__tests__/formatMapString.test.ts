import { describe, it, expect } from "vitest";
import { formatMapString } from "../formatMapString";

describe("formatMapString", () => {
  it("should remove MAP_ prefix and format map names correctly", () => {
    expect(formatMapString("MAP_ROUTE101")).toBe("Route 101");
    expect(formatMapString("MAP_PETALBURG_CITY")).toBe("Petalburg City");
    expect(formatMapString("MAP_LITTLEROOT_TOWN")).toBe("Littleroot Town");
  });

  it("should handle map names without MAP_ prefix", () => {
    expect(formatMapString("ROUTE101")).toBe("Route 101");
    expect(formatMapString("PETALBURG_CITY")).toBe("Petalburg City");
  });

  it("should handle single word map names", () => {
    expect(formatMapString("MAP_SAFARI")).toBe("Safari");
    expect(formatMapString("CAVE")).toBe("Cave");
  });

  it("should handle all uppercase map names", () => {
    expect(formatMapString("MAP_MT_PYRE")).toBe("Mt Pyre");
    expect(formatMapString("MAP_SKY_PILLAR")).toBe("Sky Pillar");
  });

  it("should handle mixed case map names", () => {
    expect(formatMapString("MAP_AquaHideout_B1F")).toBe("A quaH ideout_B 1F");
    expect(formatMapString("MAP_CaveOfOrigin_1F")).toBe("C aveO fO rigin_1F");
  });

  it("should handle empty string", () => {
    expect(formatMapString("")).toBe("");
  });

  it("should handle map names with numbers", () => {
    expect(formatMapString("MAP_ROUTE123")).toBe("Route 123");
    expect(formatMapString("MAP_ABANDONED_SHIP_1F")).toBe("Abandoned Ship 1F");
  });

  it("should handle complex map names with multiple underscores", () => {
    expect(formatMapString("MAP_EVER_GRANDE_CITY_CHAMPIONS_ROOM")).toBe("Ever Grande City Champions Room");
    expect(formatMapString("MAP_SAFARI_ZONE_NORTHWEST")).toBe("Safari Zone Northwest");
  });

  it("should trim whitespace", () => {
    expect(formatMapString("MAP_TEST_LOCATION")).toBe("Test Location");
    expect(formatMapString("MAP_A")).toBe("A");
  });
});
