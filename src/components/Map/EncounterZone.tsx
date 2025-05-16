import useMapStore from "@/stores/useMapStore";
import React from "react";
function formatString(str: string) {
  return str.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}
const EncounterZone = React.memo(function EncounterZone({
  zone,
}: {
  zone: string;
}) {
  const encounter = useMapStore((state) => {
    if (zone === "water") return state.selectedMapWaterMons;
    if (zone === "land") return state.selectedMapLandMons;
    if (zone === "fishing") return state.selectedMapFishingMons;
  });
  if (encounter) {
    return encounter.map((mon, index) => (
      <div key={`${mon}${index}`} className="icon-sprite-box -mt-1">
        <img
          className="pokemon-icon-sprite"
          src={`icon/${mon.index}/icon.webp`}
        />
      </div>
    ));
  }
});
export default EncounterZone;
