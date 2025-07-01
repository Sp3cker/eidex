import { useTransition, animated } from "@react-spring/web";
import MapPlaceInfo from "./MapPlaceInfo";
import TrainersList from "./TrainersList";
import useMapStore from "@/stores/useMapStore";
const AnimatedArea = () => {
  const isTrainersOpen = useMapStore((state) => state.isTrainersListOpen);
  const infoOrTrainers = isTrainersOpen ? "pokeInfo" : "filterBar";
  const transitions = useTransition(infoOrTrainers, {
    keys: (item) => item, // Use the view name ('pokeInfo' or 'filterBar') as the key
    from: (item) => ({
      opacity: 0,
      transform:
        item !== "filterBar" ? "translateX(100%)" : "translateX(-100%)",
    }),
    enter: {
      opacity: 1,
      transform: "translateX(0%)",
    },
    leave: (item) => ({
      opacity: 0,
      transform:
        item !== "filterBar" ? "translateX(100%)" : "translateX(-100%)",
      position: "absolute", // Crucial: keeps the leaving item from affecting layout
    }),
    config: { tension: 220, friction: 24 },
  });

  return (
    <div className="relative h-full w-full overflow-hidden bg-zinc-800">
      {transitions((style, item) => {
        if (item === "pokeInfo") {
          return (
            <animated.div style={{ ...style }} className="absolute inset-0">
              <div
                className="relative max-h-screen justify-normal overflow-y-auto rounded-lg bg-gray-700"
                onClick={(e) => e.stopPropagation()}
              >
                <TrainersList />
              </div>
            </animated.div>
          );
        } else {
          // item === "filterBar"
          return (
            <animated.div
              style={{ ...style, width: "100%", height: "100%" }}
              className="absolute inset-0"
            >
              <MapPlaceInfo />
            </animated.div>
          );
        }
      })}
    </div>
  );
};

export default AnimatedArea;
