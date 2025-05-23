const fs = require('fs');

function parseStyleObject(styleString) {
  const styleObj = {};
  const pairs = styleString.split(',');
  for (let pair of pairs) {
    const [key, value] = pair.split(':').map(s => s.trim());
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

function parseAttributes(attrString) {
  const attrs = {};
  const regex = /(\w+)\s*=\s*({[^}]+}|"[^"]*")/g;
  let match;
  while ((match = regex.exec(attrString)) !== null) {
    const attrName = match[1];
    let value = match[2];
    if (value.startsWith('{') && value.endsWith('}')) {
      value = value.slice(1, -1).trim();
      if (attrName === 'style') {
        attrs[attrName] = parseStyleObject(value);
      } else {
        attrs[attrName] = Number(value);
      }
    } else if (value.startsWith('"') && value.endsWith('"')) {
      attrs[attrName] = value.slice(1, -1);
    }
  }
  return attrs;
}

function main() {
  if (process.argv.length !== 3) {
    console.error('Usage: node svg_to_json.js <svg_data_file>');
    process.exit(1);
  }
  const filePath = process.argv[2];
  let data;
  try {
    data = fs.readFileSync(filePath, 'utf8');
  } catch (err) {
    console.error(`Error reading file: ${err.message}`);
    process.exit(1);
  }

  const gElements = data.match(/<g\b[^>]*>[\s\S]*?<\/g>/g);
  if (!gElements) {
    console.error('No <g> elements found in the file');
    process.exit(1);
  }

  const elements = [];
  for (let gMatch of gElements) {
    const gTag = gMatch.match(/<g\b[^>]*>/)[0];
    const gAttrString = gTag.slice(2, -1); // Remove <g and >
    const gAttrs = parseAttributes(gAttrString);
    const id = gAttrs.id;
    const transform = gAttrs.transform;

    const shapeMatch = gMatch.match(/<(\w+)[^>]*\/>/);
    if (shapeMatch) {
      const shapeType = shapeMatch[1];
      const shapeAttrString = shapeMatch[0].slice(shapeType.length + 2, -2); // Remove <shape and />
      const shapeAttrs = parseAttributes(shapeAttrString);
      const element = {
        id,
        transform,
        type: shapeType,
        ...shapeAttrs
      };
      elements.push(element);
    }
  }

  try {
    fs.writeFileSync('output.json', JSON.stringify(elements, null, 2));
    console.log('Successfully wrote output to output.json');
  } catch (err) {
    console.error(`Error writing output file: ${err.message}`);
    process.exit(1);
  }
}

main();