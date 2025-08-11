import { useRandomizerStore } from "@/stores/randomizerStore";

const SaveFileUploadButton = ({ onClick }: { onClick: () => void }) => {
  const { isRandomiserActive } = useRandomizerStore();

  return (
    <button
      onClick={onClick}
      className={`rounded-xs m-1 cursor-pointer ${
        isRandomiserActive ? "bg-yellow-600" : "bg-gray-500"
      } p-1 hover:bg-gray-500 active:bg-zinc-600`}
    >
      <p>{isRandomiserActive ? "✨ Randomized!" : "⚗ Upload Save File"}</p>
    </button>
  );
};

export default SaveFileUploadButton;
