import { Pokemon } from "@/types";
import { getPokemonSpriteStyle } from "@/utils/pokemonSprites";

type SpriteImageProps = {
  pokemon: Pokemon;
  className?: string;
  fallbackSrc?: string;
  mult?: number;
};

export default function SpriteImage({ pokemon }: SpriteImageProps) {
  return (
    <div
      className="rendering-crisp-edges flex-shrink-0"
      style={getPokemonSpriteStyle(pokemon.index, 64) || {}}
    />
  );
}
