import { GiSparkles } from "react-icons/gi";
import { Link } from "wouter";

const Header = () => (
  <div className="content-visibility relative flex w-full items-center justify-between bg-gray-800 px-1 py-1">
    <img
      src="/Pokemans_395-1200px.webp"
      alt="Emerald Imperium Map & Dexnav"
      className="h-9"
      height="36"
    />
    <div>
      <Link href="/roamers">
        <button
          role="button"
          title="Roamers"
          className="cursor-pointer pkmnem-face-shadow bg-fieldset font-calamity hover:bg-fieldset/80 mr-2 rounded-sm px-5 py-1 text-sm text-gray-200"
        >
          <GiSparkles size={20}/>
        </button>
      </Link>
    </div>
    <div>
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
    {/* <button
        className={`${currBreakpoint === "md" ? "hidden" : ""} pkmnem-face-shadow bg-fieldset font-pkmnem hover:bg-fieldset/80 float-right rounded-sm px-5 text-lg text-gray-200`}
        onClick={() => toggleOpen(!currOpen)}
      >
        ✨ Filters */}
    {/* </button> */}
  </div>
);
export default Header;
