const fs = require("fs");
const file = fs.readFileSync("./src/data/map/encounters.json");
function parseAndConvertSpecies(jsonData) {
  const parsedData = JSON.parse(jsonData);

  const convertSpecies = (mons) => {
    return mons.map((mon) => ({
      ...mon,
      species: mon.species.replace(/^SPECIES_/, "").toLowerCase(),
    }));
  };

  return parsedData.map((mapObj) => {
    const newMapObj = { ...mapObj };

    if (newMapObj.land_mons) {
      newMapObj.land_mons = {
        ...newMapObj.land_mons,
        mons: convertSpecies(newMapObj.land_mons.mons),
      };
    }

    if (newMapObj.water_mons) {
      newMapObj.water_mons = {
        ...newMapObj.water_mons,
        mons: convertSpecies(newMapObj.water_mons.mons),
      };
    }

    if (newMapObj.fishing_mons) {
      newMapObj.fishing_mons = {
        ...newMapObj.fishing_mons,
        mons: convertSpecies(newMapObj.fishing_mons.mons),
      };
    }

    return newMapObj;
  });
}

// Example usage:
/*
const jsonString = '[{"map":"MAP_ROUTE101","base_label":"gRoute101","land_mons":{"encounter_rate":20,"mons":[{"min_level":2,"max_level":5,"species":"SPECIES_WURMPLE"}]}}]';
const result = parseAndConvertSpecies(jsonString);
console.log(JSON.stringify(result, null, 2));
*/
(() => {
  const data = parseAndConvertSpecies(file);
  fs.writeFileSync("cleanEncounters.json", JSON.stringify(data))
})();
