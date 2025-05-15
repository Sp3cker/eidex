import useMapStore from "@/stores/useMapStore";
import "./map.css";
import maps from "@/data/map/maps.json";
const Map = () => {
  const { setSelectedMap, selectedMap } = useMapStore();
  return (
    <div className="flex flex-col cool-font">
      <div className="max-h-150 w-200 container h-full">
        {maps.map((m) => (
          <div
            className={`${m.map} ${m.type}`}
            title={m.map}
            onClick={() => setSelectedMap(m.map)}
          ></div>
        ))}
      </div>
      <p className="text-white text-xs">{JSON.stringify(selectedMap, null, 2)}</p>
      <div className="flex w-96 flex-col rounded-lg border-4 border-blue-600 bg-[#ffdf80] p-2">
        <div className="flex justify-between text-white">
          <span className="bg-black px-2 py-1">{selectedMap?.map}</span>
          <span className="bg-red-600 px-2 py-1">Chain: 99</span>
        </div>
        <div className="mt-2 flex">
          <div className="flex-1">
            <div className="bg-blue-600 px-2 py-1 text-white">Water</div>
            <div className="mt-2 grid grid-cols-5 gap-1">
              {Array(10).map((_, i) => (
                <div key={i} className="text-center text-2xl">
                  X
                </div>
              ))}
            </div>
            <div className="bg-brown-600 mt-2 px-2 py-1 text-white">Land</div>
            <div className="mt-2 grid grid-cols-5 gap-1">
              {[
                "/path/to/zubat1.png",
                "/path/to/zubat2.png",
                "/path/to/zubat3.png",
                "/path/to/zubat4.png",
                "/path/to/zubat5.png",
              ].map((src, i) => (
                <img key={i} src={src} alt="Zubat" className="h-12 w-12" />
              ))}
              {Array(5).map((_, i) => (
                <div key={i} className="text-center text-2xl">
                  {i === 4 ? "X" : ""}
                </div>
              ))}
            </div>
          </div>
          <div className="w-32 bg-gray-300 p-2">
            <div className="text-lg font-bold">Zubat</div>
            <div className="flex space-x-1">
              <span className="bg-pink-500 px-1 text-white">PSN</span>
              <span className="bg-gray-400 px-1 text-white">FLY</span>
            </div>
            <div className="mt-1 text-red-600">SEARCH LEVEL</div>
            <div className="text-lg">255</div>
            <div className="mt-1 text-red-600">METHOD</div>
            <div className="text-lg">Ha1k</div>
            <div className="mt-1 text-red-600">HIDDEN ABILITY</div>
            <div className="text-lg">Corrosion</div>
            <div className="mt-1 text-red-600">HELD ITEMS</div>
            <div className="text-lg">----------</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;
