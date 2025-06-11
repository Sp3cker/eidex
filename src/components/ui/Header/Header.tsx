import { Link } from "wouter";
import DynamicButtons from "./DynamicButtons";

const Header = () => (
  <div className="content-visibility relative flex w-full items-center justify-between bg-gray-800 px-1 py-1">
    <div className="flex flex-row items-center gap-1">
      <img
        src="/Pokemans_395-1200px.webp"
        alt="Emerald Imperium Map & Dexnav"
        className="h-9"
        height="36"
      />
      <div className="justify-self-start"></div>
      <div className="flex gap-1">
        <Link href="/dex">
          <button
            rel="noopener noreferrer"
            className="pkmnem-face-shadow bg-fieldset font-calamity hover:bg-fieldset/80 inline-block rounded-sm px-5 py-1 text-sm text-gray-200"
          >
            Dex
          </button>
        </Link>

        <Link href="/map">
          <button className="pkmnem-face-shadow bg-fieldset font-calamity hover:bg-fieldset/80 rounded-sm px-5 py-1 text-sm text-gray-200">
            Map
          </button>
        </Link>
      </div>
    </div>
    <DynamicButtons />

  </div>
);
export default Header;
