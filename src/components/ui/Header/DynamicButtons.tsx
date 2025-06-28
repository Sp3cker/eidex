import { Link, useLocation } from "wouter";
import { useUIStore } from "@/stores/uiStore";

import { GiSparkles } from "react-icons/gi";
const DynamicButtons = () => {
  const [location] = useLocation();
  const openDrawer = useUIStore((state) => state.openDrawer);
  const handleClick = () => {
    if (location === "/dex") {
      openDrawer();
    }
  };
  if (location === "/dex") {
    return (
      <button
        className={`pkmnem-face-shadow bg-fieldset font-pkmnem hover:bg-fieldset/80 float-right block rounded-sm px-5 text-lg text-gray-200 md:hidden`}
        onClick={handleClick}
      >
        ✨ Filters
      </button>
    );
  } else {
    return (
      null
      // <Link href="/roamers">
      //   <button
      //     role="button"
      //     title="Roamers"
      //     className="pkmnem-face-shadow bg-fieldset font-calamity hover:bg-fieldset/80 mr-2 cursor-pointer rounded-sm px-5 py-1 text-sm text-gray-200"
      //   >
      //     <GiSparkles size={20} />
      //   </button>
      // </Link>
    );
  }
};

export default DynamicButtons;
