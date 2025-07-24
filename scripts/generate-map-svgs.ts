import { readFileSync, writeFileSync } from 'fs';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - xmldom types are not installed; runtime import only
import { DOMParser } from '@xmldom/xmldom';

/**
 * Convert the Hoenn overview SVG (MAP-NEWDAY.svg) into a JSON definition
 * similar to the existing _mapsvgs.json file.
 *
 * HOW IT WORKS
 * 1. Parse the SVG into a DOM tree (xmldom – no browser required).
 * 2. Walk the tree; keep any element whose id starts with "MAP_".
 * 3. If a <g> wrapper contains a single shape child, hoist that child so
 *    the resulting JSON mirrors the old "children" array structure.
 * 4. Drop duplicate elements that share the same canonical id (e.g.
 *    "MAP_GRANITE_CAVE" and "MAP_GRANITE_CAVE1" have identical geometry).
 * 5. Serialise the collected objects to pretty-printed JSON.
 */

const INPUT_SVG = 'MAP-NEWDAY.svg';
const OUTPUT_JSON = '_mapsvgs.generated.json';

type StyleMap = Record<string, string | number>;

interface JsonShape {
  type: string;
  id: string;
  style?: StyleMap;
  // geometry or misc attributes
  [attr: string]: string | number | StyleMap | JsonShape[] | undefined;
}

type ShapeMap = Record<string, JsonShape>;

function parseStyle(styleString: string | null): StyleMap | undefined {
  if (!styleString) return undefined;
  const style: StyleMap = {};
  styleString.split(';').forEach((part) => {
    const [key, value] = part.split(':');
    if (!key || !value) return;
    const k = key.trim();
    const v = value.trim();
    style[k] = isNaN(Number(v)) ? v : Number(v);
  });
  return style;
}

function canonicalId(id: string): string {
  // Strip trailing numeric duplicates: MAP_SOMETHING1 -> MAP_SOMETHING
  return id.replace(/\d+$/, '');
}

function elementToShape(el: Element): JsonShape | undefined {
  const tag = el.tagName;
  const id = el.getAttribute('id');
  if (!id) return undefined;

  const shape: JsonShape = { type: tag, id: canonicalId(id) };

  // Attributes of interest by tag
  const ATTRS: Record<string, string[]> = {
    rect: ['x', 'y', 'width', 'height', 'transform'],
    circle: ['cx', 'cy', 'r', 'transform'],
    path: ['d', 'transform'],
  };

  (ATTRS[tag] || []).forEach((attr) => {
    const val = el.getAttribute(attr);
    if (val != null) shape[attr] = isNaN(Number(val)) ? val : Number(val);
  });

  const styleObj = parseStyle(el.getAttribute('style'));
  if (styleObj) shape.style = styleObj;

  return shape;
}

function hoistSingleChild(groupEl: Element): JsonShape | undefined {
  // If the group has exactly one element child, keep child geometry but mark as group
  const elementChildren = Array.from(groupEl.childNodes).filter((c) => (c as Element).tagName) as Element[];
  if (elementChildren.length !== 1) return undefined;
  const child = elementChildren[0];
  const base = elementToShape(child);
  if (!base) return undefined;
  return { type: 'g', id: canonicalId(groupEl.getAttribute('id')!), children: [base] } as JsonShape;
}

function collectShapes(root: Element): ShapeMap {
  const shapes: ShapeMap = {};

  function walk(node: Element) {
    if (node.nodeType !== 1) return; // element only
    const id = node.getAttribute('id');
    if (id && id.startsWith('MAP_')) {
      let shape: JsonShape | undefined;
      if (node.tagName === 'g') {
        shape = hoistSingleChild(node) || { type: 'g', id: canonicalId(id) };
      } else {
        shape = elementToShape(node);
      }
      if (shape) {
        const key = shape.id;
        // Deduplicate identical geometry (duplicates end with 1,2,...)
        if (!shapes[key]) {
          shapes[key] = shape;
        }
      }
    }
    // Recurse children
    Array.from(node.childNodes).forEach((c) => walk(c as Element));
  }

  walk(root);
  return shapes;
}

function main() {
  const svgRaw = readFileSync(INPUT_SVG, 'utf8');
  const doc = new DOMParser().parseFromString(svgRaw, 'image/svg+xml');
  const svgRoot = doc.documentElement;
  //@ts-ignore
  const shapeMap = collectShapes(svgRoot);
  const jsonArray = Object.values(shapeMap);
  writeFileSync(OUTPUT_JSON, JSON.stringify(jsonArray, null, 2));
  console.log(`Wrote ${jsonArray.length} map shapes → ${OUTPUT_JSON}`);
}

main()