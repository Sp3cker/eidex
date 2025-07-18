import { memo, useCallback } from "react";
import capStore from "./capStore";

const CapSelector = memo(function CapSelector() {
  const caps = capStore.use.caps();
  const setCap = capStore.use.setCurrentCap();
  const currentCap = capStore.use.currentCap();
  const handleCapChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setCap(Number(e.target.value));
    },
    [],
  );
  return (
    <div className="cap-selector-container">
      <label
        htmlFor="level-cap-select"
        className="font-calamity mt-0 text-[0.6rem] text-gray-600 md:text-[0.75rem]"
      >
        Level Cap: {"\u2006"}
      </label>
      <select
        id="level-cap-select"
        value={currentCap}
        onChange={handleCapChange}
        className="cursor-pointer rounded px-0 py-1 text-base ring-1 ring-stone-500 hover:border-slate-400 focus:border-slate-400 md:px-2 md:text-xl"
      >
        {caps.map((cap: number, index: number) => (
          <option key={index} value={cap}>
            Lv. {cap}
          </option>
        ))}
      </select>
    </div>
  );
});
export default CapSelector;
