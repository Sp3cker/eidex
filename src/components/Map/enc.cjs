const fs = require("fs");
const encounters = require("./encounters.json");

const [...s] = encounters.map((x) => ({
  map: x.map,
}));
fs.writeFileSync("MAPS", JSON.stringify(s, null, 2));
