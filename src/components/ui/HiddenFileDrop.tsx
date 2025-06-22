import { useRef } from "react";
import useMapStore from "@/stores/useMapStore";

const EncountersSelect = ({
  onChange,
  current,
}: {
  onChange: (to: "default" | "next") => void;
  current: "default" | "next";
}) => {
  const handleChange = (e: any) => {
    const { value } = e.target;

    onChange(value);
  };
  return (
    <select
      className="font-pkmnem bg-gray-700 hover:brightness-200  text-neutral-200"
      onChange={handleChange}
      value={current}
    >
      <option value="default">1.2</option>
      <option value="next">Next</option>
    </select>
  );
};
const HiddenFileDrop = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  //   const { onDrop } = useGlobalFileDrop();
  const setEncountersData = useMapStore((s) => s.setEncountersData);
  const revertToDefaultEncounters = useMapStore(
    (s) => s.revertToDefaultEncounters,
  );
  const setEncountersDataSource = useMapStore(
    (state) => state.setEncounterDataSource,
  );
  const encounterDataSource = useMapStore((s) => s.encounterDataSource);
  const hasEncountersStored = useMapStore(
    (state) => state.hasEncounterDataStored,
  );
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const text = await file.text();
        const jsonData = JSON.parse(text);
        setEncountersData(jsonData);
      } catch (error) {
        console.error("Error parsing JSON file:", error);
        // Optionally show user-friendly error message
      }
    }
    // Reset the input so the same file can be selected again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const openFileSelector = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-row text-neutral-200 cursor-pointer">
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileSelect}
        style={{ display: "none" }}
      />
      <button type="button" onClick={openFileSelector}>
        <p className="font-pkmnem leading-xs cursor-pointer text-left text-sm/3 text-white">
          Data&nbsp;for E.I.&nbsp;{hasEncountersStored || "1.2"}
        </p>
      </button>
      {hasEncountersStored && (
        <>
          <EncountersSelect
            onChange={(to: any) => setEncountersDataSource(to)}
            current={encounterDataSource}
          />
          <button onClick={() => revertToDefaultEncounters()}>♺</button>
        </>
      )}
    </div>
  );
};

export default HiddenFileDrop;
