import useMapStore from "@/stores/useMapStore";
import mapsBreakdown from "@/data/map/mapBreakdown.json";
import { useEffect } from "react";
const MMAAPPSS = new Set(
  mapsBreakdown
    .filter((m) => {
      if (m.levels.length > 1) {
        return true;
      }
    })
    .map((m) => m.mapBaseName),
);
console.log(MMAAPPSS);
const Selecta = () => {
  const selectedMap = useMapStore((state) => state.selectedMap);

  useEffect(() => {
    if (selectedMap && MMAAPPSS.has(selectedMap)) {
      console.log("SELECTA");
    }
  }, [selectedMap]);
  return <button>Selecta</button>;
};
export default Selecta;
