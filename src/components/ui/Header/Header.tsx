import { Link, useLocation } from "wouter";
import DynamicButtons from "./DynamicButtons";

const HeaderButtons = () => {
  const [location] = useLocation();

  const getLinkClassName = (href: string) => {
    let isActive = location === href;

    // Special case for map route - should be active for '/', '/map', and '/map/*'
    if (href === "/map") {
      isActive =
        location === "/" || location === "/map" || location.startsWith("/map/");
    }

    const baseClasses =
      "pkmnem-face-shadow font-calamity rounded-sm px-5 py-1 text-sm cursor-pointer  transition-colors";

    if (isActive) {
      return `${baseClasses} bg-gray-600 hover:bg-gray-500 text-white`;
    }
    return `${baseClasses} hover:bg-gray-700 text-gray-200`;
  };

  return (
    <div className="flex gap-1">
      <Link className={getLinkClassName("/map")} href="/map">
        Map
      </Link>
      <Link href="/dex" className={`${getLinkClassName("/dex")}`}>
        Dex
      </Link>
    </div>
  );
};
const Header = () => {
  return (
    <div className="content-visibility relative flex w-full items-center justify-between bg-gray-800 px-1 py-1">
      <div className="flex flex-row items-center gap-1">
        <img
          src="/Pokemans_395.webp"
          alt="Emerald Imperium Map & Dexnav"
          className="aspect-rect h-9"
          height="36"
        />
        <div className="justify-self-start">
          <HeaderButtons />
        </div>
      </div>
      <DynamicButtons />
    </div>
  );
};
export default Header;
