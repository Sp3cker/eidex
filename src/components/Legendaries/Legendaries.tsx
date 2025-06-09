import { lazy, Suspense } from "react";

const PokemonListContent = lazy(
  () => import("../Map/ItemsBox/PokemonListContent"),
);

// List of legendary Pokemon species names (based on the data I saw in speciesData.json)

const Legendaries = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="mb-2 text-3xl font-bold text-gray-200">
          Legendary Pokémon
        </h1>
        <p className="text-gray-400">
          Discover the rare and powerful legendary Pokémon in the Emerald
          Imperium region.
        </p>
      </div>

      <div className="rounded-lg bg-gray-800 p-4">
  
        <Suspense
          fallback={
            <div className="py-8 text-center text-gray-400">
              Loading legendary Pokémon...
            </div>
          }
        >
          <PokemonListContent
            pokemon={legendarySpeciesNames}
            emptyMessage="No legendary Pokémon found in this region"
          />
        </Suspense>
      </div>
    </div>
  );
};

export default Legendaries;
