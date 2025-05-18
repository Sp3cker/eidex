function extractSvgRectData(svgString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, "image/svg+xml");
  const rects = doc.getElementsByTagName("rect");
  const rectData = [];

  for (const rect of rects) {
    rectData.push({
      id: rect.getAttribute("id"),
      x: parseFloat(rect.getAttribute("x")),
      y: parseFloat(rect.getAttribute("y")),
      width: parseFloat(rect.getAttribute("width")),
      height: parseFloat(rect.getAttribute("height")),
    });
  }

  return rectData;
}
const fs = require("fs");

const data = fs.readFileSync(process.argv[1]);
const ext = extractSvgRectData(data);
fs.writeFileSync("out", JSON.stringify(data));
