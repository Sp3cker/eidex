import { readFileSync, writeFileSync } from 'fs';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - xmldom types are not installed; runtime import only
import { DOMParser, XMLSerializer } from '@xmldom/xmldom';

/**
 * Convert the Hoenn overview SVG (MAP-NEWDAY.svg) into a JSON definition
 * and a React component for the SVG structure.
 *
 * HOW IT WORKS
 * 1. Parse the SVG into a DOM tree.
 * 2. Extract all <g> elements with id starting with "MAP_" into a JSON file.
 * 3. Extract all <defs> and <use> elements.
 * 4. Generate a React component (`GeneratedReactSvg.tsx`) containing the
 *    SVG boilerplate, <defs>, and <use> tags, which accepts map objects as children.
 */

const INPUT_SVG = 'MAP-6D.svg';
const OUTPUT_JSON = '_mapsvgs.generated.json';
const OUTPUT_REACT_COMPONENT = 'src/components/Map/GeneratedReactSvg.tsx';

type StyleMap = Record<string, string | number>;

interface JsonShape {
  type: string;
  id?: string;
  style?: StyleMap;
  // geometry or misc attributes
  [attr: string]: string | number | StyleMap | JsonShape[] | undefined;
}

type ShapeMap = Record<string, JsonShape>;

function toCamelCase(str: string) {
  return str.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

function parseStyle(styleString: string | null): StyleMap | undefined {
  if (!styleString) return undefined;
  const style: StyleMap = {};
  styleString.split(';').forEach((part) => {
    const [key, value] = part.split(':');
    if (!key || !value) return;
    const k = toCamelCase(key.trim());
    const v = value.trim();
    style[k] = isNaN(Number(v)) ? v : Number(v);
  });
  return style;
}

function canonicalId(id: string): string {
  // Strip trailing numeric duplicates: MAP_SOMETHING1 -> MAP_SOMETHING
  return id.replace(/\d+$/, '');
}

function elementToChildShape(el: Element): JsonShape | undefined {
  const tag = el.tagName;
  const shape: JsonShape = { type: tag };
  const ATTRS: Record<string, string[]> = {
    rect: ['x', 'y', 'width', 'height'],
    circle: ['cx', 'cy', 'r'],
    path: ['d'],
    use: ['xlink:href', 'x', 'y', 'width', 'height', 'transform'],
  };
  (ATTRS[tag] || []).forEach((attr) => {
    const val = el.getAttribute(attr);
    if (val != null) {
      const key = toCamelCase(attr);
      shape[key] = isNaN(Number(val)) ? val : Number(val);
    }
  });
  const styleObj = parseStyle(el.getAttribute('style'));
  if (styleObj) shape.style = styleObj;
  return shape;
}

function collectMapGroups(root: Element): ShapeMap {
  const shapes: ShapeMap = {};
  function walk(node: Element) {
    if (node.nodeType !== 1) return; // element only
    const id = node.getAttribute('id');
    if (id && id.startsWith('MAP_')) {
      const children: JsonShape[] = [];
      Array.from(node.childNodes).forEach((c) => {
        if ((c as Element).tagName) {
          const childShape = elementToChildShape(c as Element);
          if (childShape) children.push(childShape);
        }
      });
      if (['rect', 'circle', 'path'].includes(node.tagName)) {
        const selfShape = elementToChildShape(node);
        if (selfShape) children.push(selfShape);
      }
      const canId = id;
      if (!shapes[canId]) {
        shapes[canId] = { type: 'g', id: canId, children };
      }
    }
    Array.from(node.childNodes).forEach((c) => walk(c as Element));
  }
  walk(root);
  return shapes;
}

function attributesToJsx(el: Element): string {
  let jsxProps = '';
  for (let i = 0; i < el.attributes.length; i++) {
    const attr = el.attributes[i];
    let name = toCamelCase(attr.name);
    if (name === 'xlinkHref') name = 'xlinkHref'; // Keep camelCase
    const value = attr.value;
    jsxProps += ` ${name}="${value}"`;
  }
  return jsxProps;
}

function generateReactComponent(svgRoot: Element) {
  const serializer = new XMLSerializer();
  let defsContent = '';
  const defsNode = svgRoot.getElementsByTagName('defs')[0];
  if (defsNode) {
    defsContent = Array.from(defsNode.childNodes)
    //@ts-ignore
      .map(node => serializer.serializeToString(node))
      .join('\n');
  }

  const useElements = Array.from(svgRoot.getElementsByTagName('use'))
    .map(el => `<use${attributesToJsx(el)} />`)
    .join('\n');

  const componentString = `
import React from 'react';

const svgStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  position: "absolute",
  top: 0,
  left: 0,
  zIndex: 1,
};

const GeneratedReactSvg = ({ children }: { children: React.ReactNode }) => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 1280 720"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      xmlSpace="preserve"
      style={svgStyle}
    >
      <defs>
        ${defsContent}
      </defs>
      <g>
        ${useElements}
        {children}
      </g>
    </svg>
  );
};

export default GeneratedReactSvg;
`;
  writeFileSync(OUTPUT_REACT_COMPONENT, componentString);
}

function main() {
  const svgRaw = readFileSync(INPUT_SVG, 'utf8');
  const doc = new DOMParser().parseFromString(svgRaw, 'image/svg+xml');
  const svgRoot = doc.documentElement;

  if (svgRoot) {
    // 1. Extract all g elements into a json file
    //@ts-ignore
    const shapeMap = collectMapGroups(svgRoot);
    const jsonArray = Object.values(shapeMap);
    writeFileSync(OUTPUT_JSON, JSON.stringify(jsonArray, null, 2));
    console.log(`Wrote ${jsonArray.length} map shapes → ${OUTPUT_JSON}`);
//@ts-ignore
    // 2. Export all use and their xlinkHref into a separate React component
    generateReactComponent(svgRoot);
    console.log(`Generated React SVG component → ${OUTPUT_REACT_COMPONENT}`);
  }
}

main();