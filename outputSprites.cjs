"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
// Read and parse JSON file
var sprites = JSON.parse(fs.readFileSync("./src/data/shinySprites.json", "utf-8"));
var xx = Object.entries(sprites);

for (const [index, data] of xx) {
  try {
    fs.writeFile(
      "./src/data/shinySpritesPNG/".concat(index, ".png"),
      Buffer.from(`${data}`, "base64"),
      {},
      function () {
        return console.log(index);
      },
    );
  } catch(err){
    console.log(err)
  }
}
