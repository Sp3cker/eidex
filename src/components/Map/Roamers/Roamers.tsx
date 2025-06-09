import React, { useEffect } from "react";
import { useLocation } from "wouter";
import legendaries from "@/data/map/legendaries-with-maps.json";
import useMapStore from "@/stores/useMapStore";

const Roamers = React.memo(function Roamers() {
  const [location] = useLocation();
  const deselectMap = useMapStore((state) => state.deselectMap);
  const legendaryRoamers = legendaries.filter(
    (l) => l.mapBasename === "MAP_HOENN",
  );
  useEffect(() => {
    if (location === "/legendaries") {
      deselectMap();
      // Your function to run when route is /legendaries
      console.log("Currently on legendaries route!");
      // Add your custom logic here
    }
  }, [location]);
  return (
    <div className="content-visibility roamers-grid content-visibility map-place-info-textbox-gradient will-translate font-calamity cursor-touch flex h-full w-[150px] flex-col overflow-scroll rounded-lg pb-1">
      {legendaryRoamers
        .map((l) => (
          <div
            key={l.speciesName}
            className="mb-2 rounded-md border-2 border-yellow-400 bg-yellow-50/10 p-2"
          >
            <h3 className="cool-font text-slate-800">{l.Pokémon}</h3>
          </div>
        ))}
    </div>
  );
});

export default Roamers;
