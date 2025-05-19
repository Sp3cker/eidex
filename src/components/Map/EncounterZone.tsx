import { useUIStore } from "@/stores/uiStore";
import { useMapStore, formatMapString } from "@/stores/useMapStore";
import {} from "@/stores/useMapStore";
import React from "react";
import { animated, useSprings } from "react-spring";

const EncounterZone = React.memo(function EncounterZone({
  zone,
}: {
  zone: string;
}) {
  const setSelectedPokemon = useUIStore(
    (state) => state.setSelectedPokemonByIndex,
  );
  const encounter = useMapStore((state) => {
    if (zone === "water") return state.selectedMapWaterMons;
    if (zone === "land") return state.selectedMapLandMons;
    if (zone === "fishing") return state.selectedMapFishingMons;
    return [];
  });
  if (encounter === undefined) return null;
  return <Zone encounter={encounter} setSelectedPokemon={setSelectedPokemon} />;
});

const Zone = React.memo(function Zone({
  encounter,
  setSelectedPokemon,
}: {
  encounter: any[];
  setSelectedPokemon: (index: number) => void;
}) {
  const [springs, api] = useSprings(
    encounter?.length,
    () => ({
      scale: 1,
      blur: 0,
      opacity: 0,
      config: { mass: 1, tension: 300, friction: 20 },
    }),
    [encounter],
  );
  const handleMouseEnter = (index: number) => {
    api.start((i) => ({
      scale: i === index ? 1.2 : 1,
      blur: i === index ? 3 : 0,
      opacity: i === index ? 0.4 : 0,
    }));
  };
  return springs.map((spring, index) => (
    <animated.div
      style={{ scale: spring.scale }}
      key={`${encounter[index].index}${index}`}
      onMouseMove={() => handleMouseEnter(index)}
      className="relative flex w-[80px] flex-col content-center items-center px-1"
      onMouseDown={() => {
        setSelectedPokemon(encounter[index].index);
      }}
    >
      <animated.div
        className="absolute h-full w-full z-0"
        style={{
          // opacity: spring.opacity,
          filter: spring.blur.to((b) => `blur(${b}px)`),
          // backgroundColor: `var(--color-neutral-900)`,
        }}
      />

      <p className="-mb-1 text-center text-xs text-neutral-100">
        {formatMapString(encounter[index].species)}
      </p>
      <div className="icon-sprite-box -mt-0">
        <img
          className="pokemon-icon-sprite"
          style={{
            filter: "drop-shadow(1px 0px 3px #2b2b2b50)",
          }}
          src={`icon/${encounter[index].index}/icon.webp`}
        />
      </div>
      <p className="float mb-1 text-start text-[8px] text-neutral-100">
        {encounter[index].rate}%
      </p>
    </animated.div>
  ));
});
export default EncounterZone;
