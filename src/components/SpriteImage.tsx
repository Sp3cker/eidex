import { Pokemon } from "@/types";

type SpriteImageProps = {
  pokemon: Pokemon;
  className?: string;
  fallbackSrc?: string;
  mult?: number;
};

export default function SpriteImage({ pokemon }: SpriteImageProps) {
  return (
    <img
      src={`/sprites/front/${pokemon.speciesId}.png`}
      className="rendering-crisp-edges flex-shrink-0"
    />
  );
}
