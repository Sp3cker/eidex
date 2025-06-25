import PokeSearch from "./PokeSearch";
import Search from "./Search";

const SearchContainer = () => {
  return (
    <div className="fade-in cool-font search-bar-grid flex flex-row gap-2 items-start">
      <Search />
      <PokeSearch />
    </div>
  );
};
export default SearchContainer;
