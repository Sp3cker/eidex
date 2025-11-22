import { useRandomizerStore } from "@/stores/randomizerStore";

const SaveFileUploadButton = ({
  onClick,
  // isOpen,
}: {
  onClick: (to: string) => void;
  isOpen: "upload" | "disclaimer" | null;
}) => {
  const { isRandomiserActive } = useRandomizerStore();
  const handleUpload = () => {
    onClick("upload");
  };
  return (
    <button
      disabled
      onClick={handleUpload}
      className={`hover-active-button rounded-xs m-1 cursor-pointer font-bold disabled:cursor-not-allowed ${
        isRandomiserActive ? "bg-yellow-600" : "bg-gray-500"
      } p-1`}
    >
      <p>
        {isRandomiserActive ? "✨ Randomized!" : "⚗ Upload Save File"}
      </p>
    </button>
  );
};

export default SaveFileUploadButton;
