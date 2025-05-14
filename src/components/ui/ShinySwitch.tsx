import { useUIStore } from "@/stores/uiStore";
import { Switch } from "@headlessui/react";

const ShinySwitch = () => {
  const { isShiny, toggleShiny } = useUIStore()   

  return (
    <Switch
      checked={isShiny}
      onMouseDown={toggleShiny}
      className="data-checked:bg-emerald-500 group inline-flex h-5 w-10 cursor-pointer items-center rounded-full bg-gray-500 transition"
    >
      <span className="group-data-checked:translate-x-6 size-3 translate-x-1 rounded-full bg-white transition" />
    </Switch>
  );
};

export default ShinySwitch;
