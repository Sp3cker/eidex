import { lazy, memo, Suspense } from "react";
import { animated, useSpring, useTransition } from "@react-spring/web";
import useMapStore from "@/stores/useMapStore";
import { shallow } from "zustand/shallow";
import { FadeInWAAPI } from "@/components/ui/FadeInWaapi";

const ItemsBox = lazy(() => import("./ItemsBox"));
const TrainerBattleInfo = lazy(() => import("../TrainerBattleInfo"));
// const anmfnc = (show: boolean, isSelectedTrainer: boolean) => {
//   return {
//     height: show ? (isSelectedTrainer ? "58vh" : "50vh") : "50vh",
//     translateY: show ? (isSelectedTrainer ? -90 : 0) : (window.innerHeight * 2) / 5,
//   };
// }

// let TS infer the correct AnimatedProps including spring values
const pages = [
  ({ style }: any) => (
    <animated.div
      key={"trainer-info"}
      style={style}
      className="absolute bottom-0 left-0 right-0 top-0 origin-top-left p-0 sm:pb-10"
    >
      <Suspense>
        <FadeInWAAPI>
          <TrainerBattleInfo />
        </FadeInWAAPI>
      </Suspense>
    </animated.div>
  ),
  ({ style }: any) => (
    <animated.div
      className="absolute bottom-0 left-0 right-0 top-0 overflow-y-auto p-2"
      style={style}
      key={"items-box"}
    >
      <Suspense>
        <FadeInWAAPI>
          <ItemsBox />
        </FadeInWAAPI>
      </Suspense>
    </animated.div>
  ),
];
const WINDOW_HEIGHT = window.innerHeight;
const HIDDEN_TRANSLATE = (WINDOW_HEIGHT * 2) / 5;

//@ts-ignore
const ANIMATE_HEIGHT = navigator.deviceMemory && navigator.deviceMemory > 4;

// const SAFE_PADDING = Object.freeze({
//   paddingBottom: "calc(env(safe-area-inset-bottom) + 1rem)",
//   paddingLeft: "env(safe-area-inset-left)",
//   paddingRight: "env(safe-area-inset-right)",
// });
export default memo(function MapItemsBox() {
  const [selectedMap, selectedTrainer, show] = useMapStore(
    (state) => [
      state.selectedMap !== null,
      state.selectedTrainer,
      state.selectedMap !== null && state.dragging === false,
    ],
    shallow,
  );

  const [springs] = useSpring(
    {
      from: {
        translateY: HIDDEN_TRANSLATE,
        scaleX: 1,
        scaleY: 1,
        transformOrigin: "bottom left",
      },
      scaleX: selectedTrainer ? 1.15 : 1,
      scaleY: selectedTrainer ? 1.25 : 1,
      translateY: show ? (selectedTrainer ? 0 : 0) : HIDDEN_TRANSLATE,
      opacity: selectedMap ? 1 : 0,

      config: { mass: 1, tension: 220, damping: 0.2 },
    },
    [show, selectedMap, selectedTrainer],
  );
  const shuffleTransition = useTransition(selectedTrainer, {
    from: (trainer: any) => ({
      translateX: "-100%",
      opacity: 0,
      scaleX: trainer ? 1 / 1.15 : 1,
      scaleY: trainer ? 1 / 1.25 : 1,
    }),
    enter: (trainer: any) => ({
      translateX: "0%",
      opacity: 1,
      scaleX: trainer ? 1 / 1.15 : 1,
      scaleY: trainer ? 1 / 1.25 : 1,
    }),
    leave: {
      translateX: "-100%",
      opacity: 0,
    },
    config: {
      tension: 280,
      friction: 25,
      mass: 0.8,
    },
  });

  return (
    <div className="dexnav-grid dexnav-z grid-rows-auto pointer-events-none relative grid grid-cols-1">
      <animated.nav
        style={springs}
        className={`will-translate map-place-info-textbox-gradient xs:row-start-10 pointer-events-auto relative row-start-10 h-[52vh] overflow-x-hidden rounded-lg border border-gray-200 drop-shadow-xl md:row-start-10`}
      >
        <div className={`flex overflow-hidden`}>
          {shuffleTransition((style, isOpen) =>
            pages[isOpen ? 0 : 1]({ style }),
          )}
        </div>
      </animated.nav>
    </div>
  );
});
