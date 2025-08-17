/* eslint-env node */
import fs from "fs";
import { load } from "cheerio";
import { transform } from "@svgr/core";
import process from 'node:process';
import { Buffer } from 'node:buffer';

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
  }
  
  const element = { type: tagName, ...attrs };
  const children = $(el)
    .children()
    .toArray()
    .filter((child) =>
      ["g", "rect", "path", "circle"].includes(
        child.tagName.toLowerCase(),
      ),
    )
    .map((child) => parseElement($, child));

  if (children.length > 0) {
    element.children = children;
  }

  return element;
}

// -----------------------------
// Single image extraction logic
// -----------------------------
function extractSingleImage({ file, idNumber = "2", outDir, out }) {
  const svgPath = file;
  const targetId = `_Image${String(idNumber)}`;
  const content = fs.readFileSync(svgPath, "utf8");

  // Try to find the image element with id and data URI in various attribute forms
  const patterns = [
    new RegExp(`<image\\s[\\s\\S]*?id=(?:\\"|\\')${targetId}(?:\\"|\\')[\\s\\S]*?(?:xlink:href|xlinkHref)=(?:\\"|\\')([^\\"\\']+)(?:\\"|\\')[\\s\\S]*?>`, 'i'),
    new RegExp(`<image\\s[\\s\\S]*?id=(?:\\"|\\')${targetId}(?:\\"|\\')[\\s\\S]*?href=(?:\\"|\\')([^\\"\\']+)(?:\\"|\\')[\\s\\S]*?>`, 'i'),
  ];

  let match = null;
  for (const re of patterns) {
    match = content.match(re);
    if (match) break;
  }

  if (!match) {
    throw new Error(`Could not find an <image> with id="${targetId}" and a data URI in ${svgPath}`);
  }

  const href = match[1];
  if (!href || !href.startsWith('data:image/')) {
    throw new Error(`Found id="${targetId}", but href is not a data URI. Found: ${href}`);
  }

  const dataMatch = href.match(/data:image\/([^;]+);base64,(.+)/);
  if (!dataMatch) {
    throw new Error('Failed to parse data URI.');
  }

  const mime = dataMatch[1].toLowerCase();
  const base64 = dataMatch[2];
  const ext = mime === 'png' ? 'png' : mime === 'webp' ? 'webp' : mime === 'jpeg' ? 'jpg' : mime;

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const outFile = out || `${outDir}/${idNumber}.${ext}`;
  fs.writeFileSync(outFile, Buffer.from(base64, 'base64'));
  return outFile;
}

async function main() {
  if (process.argv.length !== 3) {
    console.error("Usage:\n  node exportMapPlace.mjs <input.svg>");
    process.exit(1);
  }

  const filePath = process.argv[2];
  if (!filePath.toLowerCase().endsWith('.svg')) {
    console.error('Input must be an .svg file');
    process.exit(1);
  }

  // Read input
  let data;
  try {
    data = fs.readFileSync(filePath, "utf8");
  } catch (err) {
    console.error(`Error reading file: ${err.message}`);
    process.exit(1);
  }

  // Extract SVG content
  const svgMatch = data.match(/<svg[^>]*>[\s\S]*<\/svg>/);
  if (!svgMatch) {
    console.error("No <svg> element found in the file");
    process.exit(1);
  }
  const svgContent = svgMatch[0];

  const $ = load(svgContent, { xmlMode: true });
  
  // Find all elements we want to extract and store their jQuery objects
  const elementsToExtract = $("g, rect, path, circle").toArray();
  
  // Parse elements for JSON export
  const elements = elementsToExtract.map((el) => parseElement($, el));

  // Remove the extracted elements from the SVG DOM
  elementsToExtract.forEach((el) => {
    // Only remove elements that have IDs (matching our filter criteria)
    const $el = $(el);
    if ($el.attr('id')) {
      $el.remove();
    }
  });

  delete elements[0]; // It makes a G object with everything ?

  /**Becuase this works recursivley, it makes a duplicate `rect` from the rect in
   * side each `g` element
   */
  const idedElements = elements.filter((e) => {
    if (e.id !== undefined) {
      return true;
    }
    return false;
  });

  // Find the element with id="DUNGEONS" and lift its children to the top level
  const dungeonsElement = idedElements.find((e) => e.id === "DUNGEONS" && e.type === "g");
  if (dungeonsElement && dungeonsElement.children) {
    // Add the children of the DUNGEONS element to the top level
    idedElements.push(...dungeonsElement.children);
    // Remove the DUNGEONS element itself
    const index = idedElements.indexOf(dungeonsElement);
    if (index > -1) {
      idedElements.splice(index, 1);
    }
  }

  // Remove exact duplicates by creating a global Map
  const seenElements = new Set();

  function deduplicateElements(elementsArr) {
    const result = [];
    
    for (const element of elementsArr) {
      // Create a key based on type, id, and essential properties for deduplication
      let dedupeKey;

      if (element.type === "path" && element.id && element.d) {
        // For path elements, use id and d attribute (path data) as the key
        dedupeKey = `${element.type}_${element.id}_${element.d}`;
      } else if (element.type === "rect" && element.id) {
        // For rect elements, use id and position/size as key
        dedupeKey = `${element.type}_${element.id}_${element.x}_${element.y}_${element.width}_${element.height}`;
      } else if (element.type === "g" && element.id) {
        // For group elements, just use type and id
        dedupeKey = `${element.type}_${element.id}`;
      } else if (element.id) {
        // For other elements with id, use type, id and key properties
        dedupeKey = `${element.type}_${element.id}_${JSON.stringify(element.style || {})}_${element.transform || ''}`;
      } else {
        // For elements without id, use full serialization
        dedupeKey = JSON.stringify(element);
      }

      if (!seenElements.has(dedupeKey)) {
        seenElements.add(dedupeKey);
        
        // If element has children, deduplicate them recursively
        if (element.children && element.children.length > 0) {
          element.children = deduplicateElements(element.children);
        }
        
        result.push(element);
      }
    }
    
    return result;
  }

  const uniqueElements = deduplicateElements(idedElements);
  
  // Get the cleaned SVG content (with extracted elements removed)
  const cleanedSvgContent = $.html();
  
  // Use SVGR to convert the cleaned SVG to a proper React component
  try {
    const reactComponent = await transform(cleanedSvgContent, {
      plugins: ['@svgr/plugin-jsx'],
      jsxRuntime: 'automatic',
      typescript: true,
      titleProp: true,
      descProp: true,
      svgProps: {
        width: '{width}',
        height: '{height}',
        className: '{className}',
        style: '{style}',
        onClick: '{onClick}',
        onMouseOver: '{onMouseOver}',
        onMouseOut: '{onMouseOut}',
      },
    }, {
      componentName: 'SvgComponent'
    });

    // Write the files to current working directory
    fs.writeFileSync("mapsvgs.json", JSON.stringify(uniqueElements, null, 2));
    fs.writeFileSync("cleaned-svg.tsx", reactComponent);
    console.log("Successfully wrote output to mapsvgs.json and cleaned-svg.tsx");
  } catch (err) {
    console.error(`Error converting SVG to React component: ${err.message}`);
    process.exit(1);
  }

  // Always extract _Image2 to public/map-images/2.(ext)
  try {
    const outFile = extractSingleImage({ file: filePath, idNumber: '2', outDir: 'public/map-images' });
    console.log(`Extracted _Image2 -> ${outFile}`);
  } catch (err) {
    console.error(err.message || String(err));
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err && err.message ? err.message : String(err));
  process.exit(1);
});
