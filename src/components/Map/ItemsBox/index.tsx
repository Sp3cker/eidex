import ItemsBox from "./ItemsBox";
import TrainerBattleInfo from "../TrainerBattleInfo";
import { memo } from "react";
import { animated, useSpring, useTransition } from "@react-spring/web";
import useMapStore from "@/stores/useMapStore";

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
        translateY: (window.innerHeight * 2) / 5,
      },
      translateY: show ? 0 : (window.innerHeight * 2) / 5,
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
    // initial: {
    //   translateX: "1%",
    //   rotateY: 0,
    // },
    from: {
      translateX: "50%",
      rotateY: -30,
    },
    enter: {
      translateX: "1%",
      rotateY: 0,
    },
    leave: {
      translateX: "100%",
      rotateY: 30,
    },
    // expires: false, // NEED THIS
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
      style={{
        paddingBottom: "calc(env(safe-area-inset-bottom) + 1rem)",
        paddingLeft: "env(safe-area-inset-left)",
        paddingRight: "env(safe-area-inset-right)",
      }}
      className="dexnav-grid dexnav-z grid-rows-auto pointer-events-none grid grid-cols-1 overflow-hidden"
    >
      <animated.nav
        style={springs}
        className={`bg-linear-to-br pointer-events-auto relative row-start-4 rounded-lg border border-gray-200 from-emerald-50 via-white to-gray-100 p-4 drop-shadow-xl`}
      >
        {shuffleTransition((style, isOpen) => (
          <animated.div
            style={style}
            className="absolute bottom-0 left-0 right-0 top-0 p-2"
          >
            {isOpen ? (
              <div className="h-full w-full">
                <TrainerBattleInfo trainer={selectedTrainer} />
              </div>
            ) : (
              <div className="h-full w-full">
                <ItemsBox selectedMap={selectedMap} />
              </div>
            )}
          </animated.div>
        ))}
      </animated.nav>
    </div>
  );
});
