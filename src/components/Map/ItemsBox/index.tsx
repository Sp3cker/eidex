import ItemsBox from "./ItemsBox";
import TrainerBattleInfo from "../TrainerBattleInfo";
import { memo } from "react";
import { animated, useSpring, useTransition } from "@react-spring/web";
import useMapStore from "@/stores/useMapStore";
// const anmfnc = (show: boolean, isSelectedTrainer: boolean) => {
//   return {
//     height: show ? (isSelectedTrainer ? "58vh" : "50vh") : "50vh",
//     translateY: show ? (isSelectedTrainer ? -90 : 0) : (window.innerHeight * 2) / 5,
//   };
// }
const WINDOW_HEIGHT = window.innerHeight;
const SAFE_PADDING = Object.freeze({
  paddingBottom: "calc(env(safe-area-inset-bottom) + 1rem)",
  paddingLeft: "env(safe-area-inset-left)",
  paddingRight: "env(safe-area-inset-right)",
});
export default memo(function MapItemsBox() {
  const [selectedMap, selectedTrainer, show] = useMapStore((state) => [
    state.selectedMap,
    state.selectedTrainer,
    state.selectedMap !== null && state.dragging === false,
  ]);
  //   const show = useMapStore((state) => {
  //     return state.selectedMap !== null && state.dragging === false;
  //   });

  const [springs, api] = useSpring(
    {
      from: {
        height: "50vh",
        translateY: (WINDOW_HEIGHT * 2) / 5,
      },
      translateY: show ? 0 : (WINDOW_HEIGHT * 2) / 5,
      opacity: selectedMap ? 1 : 0,
      config: { mass: 1, tension: 220, damping: 0.2 },
    },
    [show, selectedMap],
  );

  const handleResizeTrainerInfo = async () => {
    if (selectedTrainer) {
      api.start({ height: "58vh", translateY: -90 });
    } else {
      api.start({ height: "50vh", translateY: 0 });
    }
  };
  const shuffleTransition = useTransition(selectedTrainer !== null, {
    from: {
      translateX: "-50%",
      opacity: 0,
    },
    enter: {
      translateX: "0%",
      opacity: 1,
    },
    initial: {
      translateX: "0%",
      opacity: 1,
    },
    leave: {
      translateX: "-100%",

      opacity: 0,
    },

    config: {
      tension: 280,
      friction: 25,
      mass: 0.8,
    },
    onRest: handleResizeTrainerInfo,
  });

  // console.log("Selected Map:", selectedMap);
  //   console.log("Selected Trainer:", selectedTrainer);
  return (
    <div
      style={SAFE_PADDING}
      className="dexnav-grid dexnav-z grid-rows-auto pointer-events-none relative grid grid-cols-1 overflow-hidden"
    >
      <animated.nav
        style={springs}
        className={`map-place-info-textbox-gradient xs:row-start-8 pointer-events-auto relative row-start-8 rounded-lg border border-gray-200 p-4 drop-shadow-xl md:row-start-10`}
      >
        <div className="flex overflow-hidden">
          {shuffleTransition((style, isOpen) => (
            <animated.div
              style={style}
              className="absolute bottom-0 left-0 right-0 top-0 overflow-hidden p-2"
            >
              {isOpen ? (
                <div className="h-full w-full">
                  {selectedTrainer && (
                    <TrainerBattleInfo trainer={selectedTrainer} />
                  )}
                </div>
              ) : (
                <div className="h-full w-full">
                  <ItemsBox selectedMap={selectedMap ?? ""} />
                </div>
              )}
            </animated.div>
          ))}
        </div>
      </animated.nav>
    </div>
  );
});
