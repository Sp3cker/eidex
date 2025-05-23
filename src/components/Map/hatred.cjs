// SVG data as a string (adjusted to standard XML syntax for parsing)
const { JSDOM } = require("jsdom");
const fs = require("fs")
const svgData = `
<g>
        <use xlink:href="#_Image1" x="0" y="0" width="1920px" height="1080px" transform="matrix(0.666667,0,0,0.666667,0,0)"/>
        <use xlink:href="#_Image2" x="1069" y="299" width="131px" height="46px"/>
        <use xlink:href="#_Image3" x="624" y="247" width="91px" height="37px"/>
        <use xlink:href="#_Image4" x="102" y="605" width="132px" height="47px"/>
        <use xlink:href="#_Image5" x="655" y="64" width="120px" height="32px"/>
        <g id="MAP_ROUTE115">
            <rect x="132.402" y="141.981" width="36.553" height="109.879" style="fill:#ebebeb;fill-opacity:0.38;"/>
        </g>
        <g id="MAP_ROUTE113">
            <rect x="282.967" y="70.229" width="139.495" height="36.744" style="fill:#ebebeb;fill-opacity:0.38;"/>
        </g>
        <g id="MAP_ROUTE111">
            <rect x="422.943" y="69.718" width="36.257" height="218.171" style="fill:#ebebeb;fill-opacity:0.38;"/>
        </g>
        <rect id="MAP_ROUTE112" x="346.03" y="179.328" width="77.455" height="33.939" style="fill:#ebebeb;fill-opacity:0.4;"/>
        <rect id="MAP_ROUTE117" x="315.024" y="288.211" width="108.627" height="35.414" style="fill:#ebebeb;fill-opacity:0.42;"/>
        <g id="MAP_ROUTE102">
            <rect x="205.486" y="396.33" width="72.942" height="35.297" style="fill:#ebebeb;fill-opacity:0.42;"/>
        </g>
        <rect id="MAP_ROUTE103" x="278.325" y="360.443" width="145.608" height="35.457" style="fill:#ebebeb;fill-opacity:0.42;"/>
        <rect id="MAP_ROUTE110" x="422.317" y="323.411" width="38.204" height="108.745" style="fill:#ebebeb;fill-opacity:0.42;"/>
        <rect id="MAP_ROUTE116" x="168.292" y="250.22" width="110.06" height="37.198" style="fill:#ebebeb;fill-opacity:0.4;"/>
        <rect id="MAP_ROUTE101" x="278.363" y="433.756" width="37.038" height="27.351" style="fill:#ebebeb;fill-opacity:0.42;"/>
        <rect id="MAP_ROUTE104" x="132.692" y="322.865" width="36.285" height="80.762" style="fill:#ebebeb;fill-opacity:0.42;"/>
        <g id="MAP_ROUTE105">
            <rect x="132.262" y="403.597" width="37.651" height="137.721" style="fill:#ebebeb;fill-opacity:0.42;"/>
        </g>
        <rect id="MAP_ROUTE106" x="133.203" y="540.347" width="107.621" height="35.867" style="fill:#ebebeb;fill-opacity:0.42;"/>
        <rect id="MAP_ROUTE119" x="530.463" y="69.019" width="38.979" height="217.992" style="fill:#ebebeb;fill-opacity:0.42;"/>
        <rect id="MAP_ROUTE118" x="494.232" y="288.402" width="75.914" height="34.983" style="fill:#ebebeb;fill-opacity:0.42;"/>
        <rect id="MAP_ROUTE121" x="640.82" y="177.693" width="145.723" height="36.773" style="fill:#ebebeb;fill-opacity:0.42;"/>
        <rect id="MAP_ROUTE120" x="603.136" y="70.687" width="37.969" height="143.877" style="fill:#ebebeb;fill-opacity:0.42;"/>
        <rect id="MAP_ROUTE123" x="572.05" y="286.876" width="177.551" height="35.981" style="fill:#ebebeb;fill-opacity:0.42;"/>
        <rect id="MAP_ROUTE122" x="709.994" y="216.405" width="40.219" height="66.734" style="fill:#ebebeb;fill-opacity:0.42;"/>
        <rect id="MAP_ROUTE107" x="242.218" y="576.856" width="112.979" height="36.049" style="fill:#ebebeb;fill-opacity:0.42;"/>
        <rect id="MAP_ROUTE108" x="355.433" y="577.241" width="67.36" height="34.882" style="fill:#ebebeb;fill-opacity:0.42;"/>
        <rect id="MAP_ROUTE109" x="422.786" y="505.228" width="35.356" height="107.768" style="fill:#ebebeb;fill-opacity:0.42;"/>
        <rect id="MAP_ROUTE134" x="461.373" y="431.206" width="108.19" height="37.339" style="fill:#ebebeb;fill-opacity:0.42;"/>
        <g id="MAP_ROUTE132">
            <rect x="670.931" y="430.961" width="77.956" height="37.735" style="fill:#ebebeb;fill-opacity:0.42;"/>
        </g>
        <rect id="MAP_ROUTE131" x="787.439" y="430.512" width="93.899" height="38.526" style="fill:#ebebeb;fill-opacity:0.42;"/>
        <g id="MAP_ROUTE130">
            <rect x="881.366" y="432.264" width="93.956" height="36.167" style="fill:#ebebeb;fill-opacity:0.42;"/>
        </g>
        <g id="MAP_ROUTE129">
            <rect x="975.034" y="432.942" width="100.333" height="34.113" style="fill:#ebebeb;fill-opacity:0.42;"/>
        </g>
        <rect id="MAP_ROUTE128" x="961.879" y="395.756" width="136.584" height="36.335" style="fill:#ebebeb;fill-opacity:0.42;"/>
        <g id="MAP_ROUTE125">
            <rect x="963.645" y="178.434" width="111.205" height="119.227" style="fill:#ebebeb;fill-opacity:0.42;"/>
        </g>
        <g id="MAP_ROUTE1281" serif:id="MAP_ROUTE128">
            <rect x="963.042" y="296.917" width="112.522" height="99.624" style="fill:#ebebeb;fill-opacity:0.42;"/>
        </g>
        <rect id="MAP_ROUTE124" x="856.4" y="179.76" width="108.03" height="117.666" style="fill:#ebebeb;fill-opacity:0.42;"/>
        <rect id="MAP_ROUTE126" x="857.039" y="298.081" width="105.966" height="97.907" style="fill:#ebebeb;fill-opacity:0.42;"/>
        <rect id="MAP_ROUTE133" x="569.371" y="430.712" width="101.515" height="37.729" style="fill:#ebebeb;fill-opacity:0.42;"/>
        <path id="MAP_MOSSDEEP_CITY" d="M1073.22,260.692L1073.22,276.689C1073.22,281.103 1069.64,284.687 1065.23,284.687L1012.61,284.687C1008.2,284.687 1004.61,281.103 1004.61,276.689L1004.61,260.692C1004.61,256.277 1008.2,252.693 1012.61,252.693L1065.23,252.693C1069.64,252.693 1073.22,256.277 1073.22,260.692Z" style="fill:#fcbbb3;fill-opacity:0.42;"/>
        <rect id="MAP_PACIFIDLOG_TOWN" x="748.131" y="432.038" width="39.386" height="34.436" style="fill:#ebebeb;fill-opacity:0.42;"/>
        <rect id="MAP_RUSTBORO_CITY" x="130.559" y="251.815" width="39.308" height="71.748" style="fill:#ebebeb;fill-opacity:0.42;"/>
        <g id="MAP_JAGGED_PATH">
            <rect x="351.351" y="116.765" width="30.278" height="27.963" style="fill:#ebebeb;fill-opacity:0.38;"/>
        </g>
        <g id="MAP_FIERY_PATH">
            <rect x="366.329" y="144.752" width="30.278" height="27.963" style="fill:#ebebeb;fill-opacity:0.38;"/>
        </g>
        <g id="MAP_LAVARIDGE_TOWN">
            <circle cx="331.978" cy="196.265" r="18.307" style="fill:#fcbbb3;fill-opacity:0.42;"/>
        </g>
        <g id="MAP_MAUVILLE_CITY">
            <rect x="423.98" y="286.667" width="70.848" height="35.195" style="fill:#ebebeb;fill-opacity:0.4;"/>
        </g>
        <rect id="MAP_SLATEPORT_CITY" x="422.095" y="432.836" width="37.799" height="72.489" style="fill:#ebebeb;fill-opacity:0.42;"/>
        <rect id="MAP_RUSTURF_TUNNEL" x="278.76" y="250.251" width="35.345" height="36.655" style="fill:#ebebeb;fill-opacity:0.42;"/>
        <g id="MAP_LILYCOVE_CITY">
            <path d="M855.584,188.772L855.584,204.769C855.584,209.183 851.999,212.767 847.587,212.767L794.971,212.767C790.556,212.767 786.972,209.183 786.972,204.769L786.972,188.772C786.972,184.357 790.556,180.774 794.971,180.774L847.587,180.774C851.999,180.774 855.584,184.357 855.584,188.772Z" style="fill:#fcbbb3;fill-opacity:0.42;"/>
        </g>
        <g id="MAP_SOOTOPOLIS_CITY">
            <circle cx="912.627" cy="341.24" r="17.649" style="fill:#fcbbb3;fill-opacity:0.42;"/>
        </g>
        <g id="MAP_EVER_GRAND_CITY">
            <path d="M1144.86,372.702L1144.86,420.97C1144.86,425.178 1141.44,428.595 1137.24,428.595L1121.99,428.595C1117.78,428.595 1114.36,425.178 1114.36,420.97L1114.36,372.702C1114.36,368.493 1117.78,365.076 1121.99,365.076L1137.24,365.076C1141.44,365.076 1144.86,368.493 1144.86,372.702Z" style="fill:#fcbbb3;fill-opacity:0.42;"/>
        </g>
        <g id="MAP_FORTREE_CITY">
            <circle cx="586.19" cy="87.807" r="17.812" style="fill:#fcbbb3;fill-opacity:0.42;"/>
        </g>
        <rect id="MAP_LITTLEROOT_TOWN" x="276.367" y="459.609" width="41.803" height="47.029" style="fill:#ebebeb;fill-opacity:0.42;"/>
        <g id="MAP_PETALBURG_CITY">
            <circle cx="187.285" cy="414.055" r="17.317" style="fill:#fcbbb3;fill-opacity:0.42;"/>
        </g>
        <g id="MAP_FALLARBOR_TOWN">
            <circle cx="259.411" cy="88.129" r="18.307" style="fill:#fcbbb3;fill-opacity:0.42;"/>
        </g>
        <g id="MAP_VERDANTURF_TOWN">
            <circle cx="295.615" cy="304.601" r="18.307" style="fill:#fcbbb3;fill-opacity:0.42;"/>
        </g>
        <rect id="MAP_DEWFORD_TOWN" x="205.804" y="576.614" width="35.474" height="35.673" style="fill:#ebebeb;fill-opacity:0.42;"/>
        <g id="MAP_METEOR_FALLS">
            <rect x="151.361" y="140.521" width="40.448" height="40.448" style="fill:#ebebeb;fill-opacity:0.38;"/>
        </g>
        <g id="MAP_OLDALE_TOWN">
            <circle cx="295.7" cy="413.622" r="18.872" style="fill:#fcbbb3;fill-opacity:0.42;"/>
        </g>
        <g id="MAP_ROUTE114">
            <rect x="173.258" y="67.977" width="67.587" height="111.016" style="fill:#fcbbb3;fill-opacity:0.42;"/>
        </g>
        <use id="MAP_GRANITE_CAVE" xlink:href="#_Image6" x="150.752" y="566.641" width="63px" height="63px"/>
        <path id="MAP_GRANITE_CAVE1" serif:id="MAP_GRANITE_CAVE" d="M194.743,588.98L194.743,603.415C194.743,607.398 191.509,610.632 187.525,610.632L173.09,610.632C169.107,610.632 165.873,607.398 165.873,603.415L165.873,588.98C165.873,584.996 169.107,581.762 173.09,581.762L187.525,581.762C191.509,581.762 194.743,584.996 194.743,588.98Z" style="fill:#ffa000;fill-opacity:0.86;stroke:#251814;stroke-width:1px;"/>
        <use id="MAP_MT_PYRE" xlink:href="#_Image6" x="699.201" y="223.81" width="63px" height="63px"/>
        <path id="MAP_MT_PYRE1" serif:id="MAP_MT_PYRE" d="M743.192,246.149L743.192,260.584C743.192,264.567 739.958,267.801 735.974,267.801L721.539,267.801C717.556,267.801 714.322,264.567 714.322,260.584L714.322,246.149C714.322,242.165 717.556,238.931 721.539,238.931L735.974,238.931C739.958,238.931 743.192,242.165 743.192,246.149Z" style="fill:#ffa000;fill-opacity:0.86;stroke:#251814;stroke-width:1px;"/>
        <use id="MAP_VICTORY_ROAD" xlink:href="#_Image6" x="1095.01" y="323.693" width="63px" height="63px"/>
        <path id="MAP_VICTORY_ROAD1" serif:id="MAP_VICTORY_ROAD" d="M1139,346.031L1139,360.466C1139,364.449 1135.77,367.683 1131.78,367.683L1117.35,367.683C1113.37,367.683 1110.13,364.449 1110.13,360.466L1110.13,346.031C1110.13,342.047 1113.37,338.813 1117.35,338.813L1131.78,338.813C1135.77,338.813 1139,342.047 1139,346.031Z" style="fill:#ffa000;fill-opacity:0.86;stroke:#251814;stroke-width:1px;"/>
        <use id="MAP_SAFARI_ZONE_SOUTHWEST" xlink:href="#_Image6" x="692.333" y="133.473" width="63px" height="63px"/>
        <path id="MAP_SAFARI_ZONE_SOUTHWEST1" serif:id="MAP_SAFARI_ZONE_SOUTHWEST" d="M736.324,155.812L736.324,170.247C736.324,174.23 733.09,177.464 729.106,177.464L714.671,177.464C710.688,177.464 707.454,174.23 707.454,170.247L707.454,155.812C707.454,151.828 710.688,148.594 714.671,148.594L729.106,148.594C733.09,148.594 736.324,151.828 736.324,155.812Z" style="fill:#ffa000;fill-opacity:0.86;stroke:#251814;stroke-width:1px;"/>
        <use id="MAP_SAFARI_ZONE_SOUTH" xlink:href="#_Image6" x="722.537" y="115.284" width="63px" height="63px"/>
        <path id="MAP_SAFARI_ZONE_SOUTH1" serif:id="MAP_SAFARI_ZONE_SOUTH" d="M766.528,137.622L766.528,152.057C766.528,156.04 763.294,159.274 759.31,159.274L744.875,159.274C740.892,159.274 737.658,156.04 737.658,152.057L737.658,137.622C737.658,133.638 740.892,130.404 744.875,130.404L759.31,130.404C763.294,130.404 766.528,133.638 766.528,137.622Z" style="fill:#ffa000;fill-opacity:0.86;stroke:#251814;stroke-width:1px;"/>
        <use id="MAP_SAFARI_ZONE_NORTH" xlink:href="#_Image6" x="703.935" y="78.904" width="63px" height="63px"/>
        <path id="MAP_SAFARI_ZONE_NORTH1" serif:id="MAP_SAFARI_ZONE_NORTH" d="M747.926,101.242L747.926,115.677C747.926,119.661 744.692,122.895 740.708,122.895L726.273,122.895C722.29,122.895 719.056,119.661 719.056,115.677L719.056,101.242C719.056,97.259 722.29,94.025 726.273,94.025L740.708,94.025C744.692,94.025 747.926,97.259 747.926,101.242Z" style="fill:#ffa000;fill-opacity:0.86;stroke:#251814;stroke-width:1px;"/>
        <use id="MAP_SAFARI_ZONE_NORTHWEST" xlink:href="#_Image6" x="672.731" y="97.094" width="63px" height="63px"/>
    </g>
    <path id="MAP_SAFARI_ZONE_NORTHWEST1" serif:id="MAP_SAFARI_ZONE_NORTHWEST" d="M716.722,119.432L716.722,133.867C716.722,137.85 713.488,141.084 709.504,141.084L695.069,141.084C691.086,141.084 687.852,137.85 687.852,133.867L687.852,119.432C687.852,115.449 691.086,112.214 695.069,112.214L709.504,112.214C713.488,112.214 716.722,115.449 716.722,119.432Z" style="fill:#ffa000;fill-opacity:0.86;stroke:#251814;stroke-width:1px;"/>

`;


// Function to parse style string into an object
function parseStyle(styleString) {
  if (!styleString) return {};
  const styleObj = {};
  styleString.split(';').forEach(pair => {
    const [key, value] = pair.split(':').map(s => s.trim());
    if (key && value) {
      const camelKey = key.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
      styleObj[camelKey] = value;
      if (camelKey === 'strokeWidth' && !value.endsWith('px')) {
        styleObj[camelKey] = value + 'px';
      }
    }
  });
  return styleObj;
}

// Function to parse path's d attribute
function parsePathD(d) {
  if (!d) return [];
  const commands = [];
  const regex = /([MLHVCSQTAZ])([^MLHVCSQTAZ]*)/gi;
  let match;
  while ((match = regex.exec(d))) {
    const command = match[1];
    const params = match[2]
      .trim()
      .split(/[\s,]+/)
      .map(parseFloat)
      .filter(n => !isNaN(n));
    commands.push({ command, params });
  }
  return commands;
}

// Function to apply transform to coordinates
function applyTransform(x, y, transform) {
  if (!transform || !transform.startsWith('matrix')) return { x, y };
  const matrixMatch = transform.match(/matrix\(([^)]+)\)/);
  if (!matrixMatch) return { x, y };
  const [a, b, c, d, e, f] = matrixMatch[1].split(/[\s,]+/).map(parseFloat);
  return {
    x: a * x + c * y + e,
    y: b * x + d * y + f
  };
}

// Function to extract x, y from path's d attribute (first M command)
function getPathXY(d) {
  const parsed = parsePathD(d);
  const moveTo = parsed.find(cmd => cmd.command === 'M' || cmd.command === 'm');
  if (!moveTo || moveTo.params.length < 2) return { x: 0, y: 0 };
  return { x: moveTo.params[0], y: moveTo.params[1] };
}

// Function to calculate transform from use element's x and y
function calculateTransformFromUse(useElement) {
  const x = parseFloat(useElement.getAttribute('x')) || 0;
  const y = parseFloat(useElement.getAttribute('y')) || 0;
  return `matrix(1,0,0,1,${x},${y})`;
}

// Main function to parse SVG to JSON
function svgToJson(svgString, viewBoxWidth = 1280, viewBoxHeight = 720) {
  const { window } = new JSDOM(svgString);
  const { document } = window;
  const jsonObjects = [];
  const useElements = new Map();

  // Collect all <use> elements
  document.querySelectorAll('use').forEach(use => {
    const id = use.getAttribute('id');
    if (id) useElements.set(id, use);
  });

  // Process <use> elements
  document.querySelectorAll('use').forEach(element => {
    const id = element.getAttribute('id');
    if (id) {
      const obj = {
        id,
        type: 'use',
        x: parseFloat(element.getAttribute('x')) || 0,
        y: parseFloat(element.getAttribute('y')) || 0,
        width: parseFloat(element.getAttribute('width')) || 0,
        height: parseFloat(element.getAttribute('height')) || 0,
        xlinkHref: element.getAttribute('xlink:href') || ''
      };
      jsonObjects.push(obj);
    }
  });

  // Process <g> elements
  document.querySelectorAll('g').forEach(g => {
    const id = g.getAttribute('id');
    const shape = g.querySelector('rect, circle, path');
    if (id) {
      const obj = { id, type: 'g' };
      if (shape) {
        if (shape.tagName === 'rect') {
          obj.x = parseFloat(shape.getAttribute('x')) || 0;
          obj.y = parseFloat(shape.getAttribute('y')) || 0;
          obj.width = parseFloat(shape.getAttribute('width')) || 0;
          obj.height = parseFloat(shape.getAttribute('height')) || 0;
          obj.shapeType = 'rect';
        } else if (shape.tagName === 'circle') {
          obj.x = parseFloat(shape.getAttribute('cx')) || 0;
          obj.y = parseFloat(shape.getAttribute('cy')) || 0;
          obj.r = parseFloat(shape.getAttribute('r')) || 0;
          obj.shapeType = 'circle';
        } else if (shape.tagName === 'path') {
          const d = shape.getAttribute('d') || '';
          const { x, y } = getPathXY(d);
          obj.x = x;
          obj.y = y;
          obj.d = d;
          obj.parsedD = parsePathD(d);
          obj.shapeType = 'path';
        }
        obj.style = parseStyle(shape.getAttribute('style'));
      } else {
        obj.x = 0;
        obj.y = 0;
      }
      if (g.getAttribute('transform')) {
        obj.transform = g.getAttribute('transform');
      }
      jsonObjects.push(obj);
    }
  });

  // Process standalone <rect>, <circle>, <path> elements
  ['rect', 'circle', 'path'].forEach(tag => {
    document.querySelectorAll(`${tag}:not(g *)`).forEach(element => {
      const id = element.getAttribute('id');
      if (id) {
        const obj = { id, type: tag };
        let transform = element.getAttribute('transform');
        if (tag === 'rect') {
          obj.x = parseFloat(element.getAttribute('x')) || 0;
          obj.y = parseFloat(element.getAttribute('y')) || 0;
          obj.width = parseFloat(element.getAttribute('width')) || 0;
          obj.height = parseFloat(element.getAttribute('height')) || 0;
        } else if (tag === 'circle') {
          obj.x = parseFloat(element.getAttribute('cx')) || 0;
          obj.y = parseFloat(element.getAttribute('cy')) || 0;
          obj.r = parseFloat(element.getAttribute('r')) || 0;
        } else if (tag === 'path') {
          const d = element.getAttribute('d') || '';
          const { x, y } = getPathXY(d);
          obj.x = x;
          obj.y = y;
          obj.d = d;
          obj.parsedD = parsePathD(d).map(cmd => {
            const transformedParams = [];
            for (let i = 0; i < cmd.params.length; i += 2) {
              const x = cmd.params[i];
              const y = cmd.params[i + 1];
              const transformed = applyTransform(x, y, transform);
              transformedParams.push(transformed.x, transformed.y);
            }
            return { command: cmd.command, params: transformedParams };
          });
          const baseId = id.replace(/1$/, '');
          const useElement = useElements.get(baseId);
          if (useElement) {
            transform = calculateTransformFromUse(useElement);
            obj.transform = transform;
            // Re-apply transform to parsedD coordinates
            obj.parsedD = parsePathD(d).map(cmd => {
              const transformedParams = [];
              for (let i = 0; i < cmd.params.length; i += 2) {
                const x = cmd.params[i];
                const y = cmd.params[i + 1];
                const transformed = applyTransform(x, y, transform);
                transformedParams.push(transformed.x, transformed.y);
              }
              return { command: cmd.command, params: transformedParams };
            });
            // Update x, y with transformed coordinates
            const transformedXY = applyTransform(x, y, transform);
            obj.x = transformedXY.x;
            obj.y = transformedXY.y;
          }
        }
        obj.style = parseStyle(element.getAttribute('style'));
        if (transform) {
          obj.transform = transform;
        }
        jsonObjects.push(obj);
      }
    });
  });

  return jsonObjects;
}

// Execute and output the result
const jsonResult = svgToJson(svgData, 1280, 720);
console.log(JSON.stringify(jsonResult, null, 2));

// Save to a file
fs.writeFileSync('output.json', JSON.stringify(jsonResult, null, 2));