import useMapStore from "@/stores/useMapStore";

const TimeSelect = ({ parentHeight }: { parentHeight: number }) => {
  const { shouldShow } = useMapStore((state) => ({
    shouldShow: state.selectedLevelLandMons !== undefined,
  }));
  const topStyle = {
    top: `${parentHeight / 3 - (Math.sqrt(parentHeight) + 20)}px`,
    opacity: shouldShow ? 1 : 0,
  };
  return (
    <div
      className="font-pkmnem absolute -left-7 flex flex-col rounded-sm bg-amber-700 text-lg"
      style={topStyle}
    >
      <button className="rounded-xs hover-active-button map-place-info-textbox-gradient m-1 cursor-pointer py-2">
        ⛅
      </button>
      <button className="rounded-xs hover-active-button map-place-info-textbox-gradient m-1 cursor-pointer py-2">
        ☾
      </button>
    </div>
  );
};

export default TimeSelect;
