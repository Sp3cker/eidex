import { PokemonCard } from "./PokemonCard";
import useBodyScrollLock from "../../hooks/useBodyScrollLock";
import { SortBar } from "./PokemonSortBar";
import { useUIStore } from "@/stores/uiStore";
import usePokemonStore from "@/stores/pokemonStore";
import { FixedSizeList as List } from "react-window";
import { Pokemon } from "@/types";
import { useState, useEffect } from "react";
const rootFontSize = parseFloat(
  getComputedStyle(document.documentElement).fontSize,
);

// Row component for react-window
const PokemonRow = ({
  index,
  style,
  data,
}: {
  index: number;
  style: React.CSSProperties;
  data: Pokemon[];
}) => (
  <div style={style}>
    <PokemonCard pokemon={data[index]} />
  </div>
);

// Hook to get responsive item height
const useItemHeight = () => {
  const [itemHeight, setItemHeight] = useState(120); // Default height in pixels

  useEffect(() => {
    const updateHeight = () => {
      const heightInRem = 15; // 6.25rem = 100px, 7.5rem = 120px (at 16px base)

      setItemHeight(heightInRem * rootFontSize);
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  return itemHeight;
};

export default function PokemonList() {
  const pokemon = usePokemonStore();
  const isModalOpen = useUIStore((state) => state.isModalOpen);
  const itemHeight = useItemHeight();

  // Prevent background scroll when modal is open
  useBodyScrollLock(isModalOpen);

  return (
    <div className="flex w-full select-none flex-col items-center">
      <SortBar />
      <div className="w-full">
        <List
          height={window.innerHeight - 100} // Footer Height
          width="100%"
          itemCount={pokemon.length}
          itemSize={itemHeight}
          itemData={pokemon}
        >
          {PokemonRow}
        </List>
      </div>
    </div>
  );
}
