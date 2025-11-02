import PokeSearch from "./PokeSearch";
import Search from "./Search";

const SearchContainer = () => {
  return (
    <div className="fade-in font-calamity search-bar-grid flex flex-row items-start gap-2">
      <Search />
      <PokeSearch />
    </div>
  );
};
export default SearchContainer;
