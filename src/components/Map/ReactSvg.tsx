import React, { useEffect, useMemo, useState } from "react";
import map_sections from "@/data/map/reconstructed_map_sections.json";
import { useMapStore } from "@/stores/useMapStore";
import { LevelsInfo } from "@/data/map";
import { encounterStore } from "@/data/map/encounters";

const encounterData = encounterStore.getEncounterData();

export default React.memo(function ReactSvg() {
  const setSelectedMap = useMapStore((state) => state.setSelectedMap);
  const selectedMap = useMapStore((state) => state.selectedMap);
  const [svgDimensions, setSvgDimensions] = useState<[number?, number?]>([
    undefined,
    undefined,
  ]);
  const svgRef = React.useRef<SVGSVGElement>(null);
  useEffect(() => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const mapRect = document.getElementById("map")?.getBoundingClientRect();
    if (!mapRect) return;
    setSvgDimensions([rect.width, rect.height]);
    // Register coordinates in your global store here
  }, [svgRef.current]);
  const toRender = useMemo(() => {
    if (!svgRef.current) return [];
    const mapRect = document.getElementById("map")?.getBoundingClientRect();
    if (!mapRect) return;

    return map_sections["map_sections"]
      .map((obj) => {
        obj.id = obj.id.replace(/SEC/g, "");
        useMapStore
          .getState()
          .storedCoordinates.set(obj.id, [
            obj.x + obj.width / 2 - (svgDimensions[0]!) / 2,
            obj.y + obj.height / 2 - (svgDimensions[1]!) / 2,
          ]);
        return obj;
      })
      .filter(({ id }) => {
        const lookupId = id.replace(/SEC/g, "");
        if (LevelsInfo[lookupId]) {
          return true;
        }
        if (encounterData[lookupId]) {
          return true;
        }
        return false;
      })
      .sort((a, b) => {
        const areaA = a.width * a.height;
        const areaB = b.width * b.height;
        return areaB - areaA;
      });
  }, [svgRef.current]);

  return (
    <div className="relative flex h-full w-full items-center justify-center bg-slate-900">
      <svg
        viewBox="0 0 1200 800"
        ref={svgRef}
        className="h-auto max-h-screen w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <image href="/hearth-map.png" width="1200" height="800" />
        {toRender && toRender.map((section) => (
          <rect
            key={section.id}
            x={section.x}
            y={section.y}
            width={section.width}
            height={section.height}
            className={`cursor-pointer transition-all duration-200 filter ${
              selectedMap === section.id
                ? "fill-yellow-400/40 stroke-yellow-400 stroke-2"
                : "fill-[var(--hearth-orange-3)]/25 stroke-[var(--hearth-gray-2)] border-2 hover:fill-white/20 hover:stroke-white/50 hover:stroke-1"
            } `}
            onClick={() => setSelectedMap(section.id || "")}
          >
            <title>{section.name}</title>
          </rect>
        ))}
      </svg>
    </div>
  );
});
