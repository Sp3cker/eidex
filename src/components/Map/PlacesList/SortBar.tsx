import { memo } from "react";
import { usePlacesListSortStore } from "@/stores/placesListSortStore";

const SortBar = memo(function SortBar({
  rightSide,
}: {
  rightSide?: React.ReactNode;
}) {
  const { sortMode, setSortMode } = usePlacesListSortStore();

  return (
    <div className="flex w-full gap-2 border-b border-gray-200 bg-white/80 p-2 backdrop-blur-sm">
      <div className="flex gap-1 rounded-lg bg-gray-100">
        <button
          onClick={() => setSortMode("alphabetical")}
          className={`font-pkmnem flex items-center gap-2 rounded-md px-3 py-1.5 font-bold transition-colors ${
            sortMode === "alphabetical"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          }`}
          type="button"
        >
          ⇅ A-Z
        </button>

        <button
          onClick={() => setSortMode("grouped")}
          className={`font-pkmnem flex items-center gap-2 rounded-md px-3 py-1.5 font-bold transition-colors ${
            sortMode === "grouped"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          }`}
          type="button"
        >
          Type ♙
        </button>
      </div>
      {rightSide}
    </div>
  );
});

export default SortBar;
