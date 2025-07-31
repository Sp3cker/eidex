import fs from "fs";
import cheerio from "cheerio";
import { transform } from "@svgr/core";

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

async function main() {
  if (process.argv.length !== 3) {
    console.error("Usage: node svg_to_json.js <svg_file>");
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

  // Extract SVG content
  const svgMatch = data.match(/<svg[^>]*>[\s\S]*<\/svg>/);
  if (!svgMatch) {
    console.error("No <svg> element found in the file");
    process.exit(1);
  }
  let svgContent = svgMatch[0];

  // Detect if this is a React component (has style={{ or JSX braces})
  const isReactComponent = /style={{|\{.*?\}/.test(svgContent);
  if (isReactComponent) {
    svgContent = preprocessJSX(svgContent);
  }

  const $ = cheerio.load(svgContent, { xmlMode: true });
  
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

  function deduplicateElements(elements) {
    const result = [];
    
    for (const element of elements) {
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

    // Write the files
    fs.writeFileSync("mapsvgs.json", JSON.stringify(uniqueElements, null, 2));
    fs.writeFileSync("cleaned-svg.tsx", reactComponent);
    console.log("Successfully wrote output to mapsvgs.json and cleaned-svg.tsx");
  } catch (err) {
    console.error(`Error converting SVG to React component: ${err.message}`);
    process.exit(1);
  }
}

main().catch(console.error);
