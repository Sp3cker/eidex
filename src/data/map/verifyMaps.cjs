const fs = require("fs");

const mapsList = JSON.parse(fs.readFileSync("./src/data/map/maps.json"));
const encounters = JSON.parse(
  fs.readFileSync("./src/data/map/cleanEncounters.json", {
    encoding: "utf-8",
  }),
);

const maps = new Set(mapsList.map((m) => m.map));

for (const encounter of encounters) {
  if (!maps.has(encounter.map)) {
    console.log(`Missing map: ${encounter.map}`);
  }
}
