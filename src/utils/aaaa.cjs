const frames = require("./frames.json");
const species = Object.values(require("../data/speciesData.json"));
const otherSpecies = Object.values(require("../data/allSpecies.json"));
const fs = require("fs");
function normalizeStringIntl(str) {
  // The order of this probably matters lol
  if (str === null) {
    return;
  }
  return str
    .normalize("NFD") // Decompose accented characters
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritical marks
    .replace(" ", "_") // Replace spaces, hyphens, and periods with underscores
    .replace(/[-]/g, "_") // Replace spaces, hyphens, and periods with underscores
    .replace(".", "")
    .replace("’", "")
    .replace("'", "")
    .replace(/_$/g, "") //Mine Jr. -> Mime_Jr;
    .replace("Flab?b?", "Flabebe")
    .replace(":", "") // type: null
    .replace("♀", "_f")
    .replace("♂", "_m")
    .replace("_", "")
    .toLowerCase();
}

(() => {
  const newFramesList = [];
  for (const poke of species) {
    const goodName = normalizeStringIntl(poke.name);
    const framedNames = frames.map((f) => normalizeStringIntl(f.speciesName));
    const pokesFramesIndex = framedNames.indexOf(goodName);
    if (pokesFramesIndex === -1) {
      console.error(`Pokemon name not normalized: ${goodName}`);
    }
    const newFramesWId = { ...frames[pokesFramesIndex] };
    const goodNameIndex = species.findIndex(
      (s) => normalizeStringIntl(s.name) === goodName,
    );
    if (goodNameIndex === -1) {
      throw "FUCK";
    }
    newFramesWId.id = species[goodNameIndex].ID;
    newFramesWId.dexID = species[goodNameIndex].dexID;

    const otherSpecIndex = otherSpecies
      .filter((o) => o.speciesName !== undefined)
      .findIndex((o) => normalizeStringIntl(o.speciesName) === goodName);
    if (otherSpecIndex === -1) {
     console.error("Not getting real animation for %s", goodName)
     newFramesWId.animation = otherSpecies[40].frontAnimId;
     continue
    }
    newFramesWId.animation = otherSpecies[otherSpecIndex].frontAnimId
    newFramesList.push(newFramesWId);
  }
  fs.writeFileSync("newframes.json", JSON.stringify(newFramesList, 2, null));
})();
