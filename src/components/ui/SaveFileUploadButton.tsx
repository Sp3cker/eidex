import { useRandomizerStore } from "@/stores/randomizerStore";

const SaveFileUploadButton = ({onClick}:{onClick: (to: string) => void}) => {
  const { isRandomiserActive } = useRandomizerStore();

  return (
    <button
      onClick={() =>onClick("upload")}
      className={`rounded-xs m-1 font-bold cursor-pointer ${
        isRandomiserActive ? "bg-yellow-600" : "bg-gray-500"
      } p-1 hover:bg-gray-500 active:bg-zinc-600`}
    >
      <p>{isRandomiserActive ? "✨ Randomized!" : "⚗ Coming soon..."}</p>
    </button>
  );
};

export default SaveFileUploadButton;
