import { useMapStore, formatMapString } from "@/stores/useMapStore";

const MapPlaceInfo = () => {
  const selectedMap = useMapStore((state) => state.selectedMap) || "";
  return (
    <div className="top-100 absolute flex h-full w-full items-center justify-center">
      <div className="rounded bg-white p-4 shadow-lg">
        <h2 className="text-xl font-bold">{formatMapString(selectedMap)}</h2>
        <p>Details about the selected place will go here.</p>
      </div>
    </div>
  );
};

export default MapPlaceInfo;
