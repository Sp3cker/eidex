const { writeFileSync } = require("node:fs");
const gen1 = require("./src/data/finale_gen_1.json");
const gen2 = require("./src/data/finale_gen_2.json");
const gen3 = require("./src/data/finale_gen_3.json");
const gen4 = require("./src/data/finale_gen_4.json");
const gen5 = require("./src/data/finale_gen_5.json");
const gen6 = require("./src/data/finale_gen_6.json");
const gen7 = require("./src/data/finale_gen_7.json");
const gen8 = require("./src/data/finale_gen_8.json");
const gen9 = require("./src/data/finale_gen_9.json");

const newe = [
  ...gen1,
  ...gen2,
  ...gen3,
  ...gen4,
  ...gen5,
  ...gen6,
  ...gen7,
  ...gen8,
  ...gen9,
];
writeFileSync("allSpecies.json", JSON.stringify(newe));
