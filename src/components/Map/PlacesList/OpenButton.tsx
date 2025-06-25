import { memo } from "react";
import { useMapStore } from "@/stores/useMapStore";

interface OpenButtonProps {
  className?: string;
}

const OpenButton = memo(function OpenButton({ className }: OpenButtonProps) {
  const setPlacesListOpen = useMapStore((state) => state.setPlacesListOpen);

  return (
    <div
      className={`fixed left-0 top-1/2 z-30 -translate-y-1/2 cursor-pointer rounded-r-lg border border-l-0 border-gray-200 bg-gradient-to-br from-emerald-50 via-white to-gray-100 px-2 py-4 shadow-lg transition-all duration-200 hover:bg-emerald-100 ${className || ""}`}
      style={{
        left: 'max(0px, env(safe-area-inset-left))',
      }}
      onClick={() => setPlacesListOpen(true)}
    >
      <svg
        className="h-5 w-5 text-gray-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </div>
  );
});

export default OpenButton;
