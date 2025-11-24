import useMapStore from "@/stores/useMapStore";

const TimeSelect = ({ parentHeight }: { parentHeight: number }) => {
  const { setTime, time } = useMapStore((state) => ({
    // shouldShow: state.selectedLevelLandMons !== undefined,
    time: state.time,
    setTime: state.setTime,
  }));
  const toggleTime = () => {
    setTime(time === "day" ? "night" : "day");
  };
  const topStyle = {
    top: `${parentHeight / 3 - (Math.sqrt(parentHeight) + 20)}px`,
  };
  return (
    <div
      className="font-pkmnem absolute -left-7 flex flex-col rounded-sm bg-amber-700 text-lg"
      style={topStyle}
    >
      <button
        onPointerDown={toggleTime}
        className="rounded-xs min-w-5 hover-active-button map-place-info-textbox-gradient m-1 cursor-pointer py-2"
      >
        {time === "day" ? "⛅" : "☾"}
      </button>
      
    </div>
  );
};

export default TimeSelect;
