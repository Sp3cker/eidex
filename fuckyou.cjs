const fs = require("fs");
const cheerio = require("cheerio");

function parseStyleObject(styleString) {
  const styleObj = {};
  if (!styleString) return styleObj;
  const pairs = styleString.split(",").map((s) => s.trim());
  for (let pair of pairs) {
    const [key, value] = pair.split(":").map((s) => s.trim());
    if (!key || !value) continue;
    if (value.startsWith('"') && value.endsWith('"')) {
      styleObj[key] = value.slice(1, -1);
    } else if (!isNaN(value)) {
      styleObj[key] = Number(value);
    } else {
      styleObj[key] = value;
    }
  }
  return styleObj;
}
// First we un-make it a React Component :S
function preprocessJSX(content) {
  content = content.replace(/style={{([^}]+)}}/g, (match, styleContent) => {
    const styleObj = parseStyleObject(styleContent);
    const styleString = Object.entries(styleObj)
      .map(([k, v]) => `${k.replace(/([A-Z])/g, "-$1").toLowerCase()}:${v}`)
      .join(";");
    return `style="${styleString}"`;
  });
  content = content.replace(/(\w+)={([^}]+)}/g, '$1="$2"');
  return content;
}

function parseElement($, el) {
  const tagName = el.tagName.toLowerCase();
  const attrs = {};
  for (let attr of Object.keys(el.attribs || {})) {
    let value = el.attribs[attr];

    if (attr === "style") {
      attrs[attr] = parseStyleObject(
        value
          .split(";")
          .map((s) => {
            const [k, v] = s.split(":").map((t) => t.trim());
            return `${k.replace(/-([a-z])/g, (_, c) => c.toUpperCase())}:${v}`;
          })
          .join(","),
      );
    } else if (!isNaN(value)) {
      attrs[attr] = Number(value);
    } else if (attr === "serif:id") {
      attrs["id"] = value;
    } else {
      attrs[attr] = value;
    }
    if (tagName === "use") {
      attrs["id"] = attrs["xlinkHref"] + attrs["x"] + attrs["y"];
    }
  }
  const element = { type: tagName, ...attrs };
  const children = $(el)
    .children()
    .toArray()
    .filter((child) =>
      ["g", "rect", "path", "circle", "use"].includes(
        child.tagName.toLowerCase(),
      ),
    )
    .map((child) => parseElement($, child));

  if (children.length > 0) {
    element.children = children;
  }

  return element;
}

function main() {
  if (process.argv.length !== 3) {
    console.error("Usage: node svg_to_json.js <react_svg_file>");
    process.exit(1);
  }

  const filePath = process.argv[2];
  let data;
  try {
    data = fs.readFileSync(filePath, "utf8");
  } catch (err) {
    console.error(`Error reading file: ${err.message}`);
    process.exit(1);
  }

  const svgMatch = data.match(/<svg[^>]*>[\s\S]*<\/svg>/);
  if (!svgMatch) {
    console.error("No <svg> element found in the file");
    process.exit(1);
  }
  let svgContent = svgMatch[0];

  svgContent = preprocessJSX(svgContent);

  const $ = cheerio.load(svgContent, { xmlMode: true });
  const elements = $("g, rect, path, circle, use")
    .toArray()
    .map((el) => parseElement($, el));

  delete elements[0]; // It makes a G object with everything ?

  /**Becuase this works recursivley, it makes a duplicate `rect` from the rect in
   * side each `g` element
   */
  const idedElements = elements.filter((e) => {
    if (e.id !== undefined) {
      return e;
    }
  });
  const idedElementsIds = new Set(idedElements.map((e) => e.id));
  // const uniqueIdedElements = idedElements.filter(e => {
  //   if (idedElementsIds.has(e.id))
  // })
  try {
    fs.writeFileSync("mapsvgs.json", JSON.stringify(idedElements, null, 2));
    console.log("Successfully wrote output to output.json");
  } catch (err) {
    console.error(`Error writing output file: ${err.message}`);
    process.exit(1);
  }
}

main();
