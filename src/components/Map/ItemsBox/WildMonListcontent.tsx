import { makeTypeObjects } from "@/utils/typeInfo";
import { pokemonDataMap } from "@/data/pokemon";
import { BaseListContent } from "./BaseListContent";
import { formatSpeciesString } from "@/utils/formatMapString";
import SmallTypeBadge from "@/components/ui/SmallTypeBadge";
import { LevelScriptedEventMon } from "@/data/map";
const WildMonListRender = (wildMon: any) => (
  <div className="flex flex-row justify-between">
    <hgroup>
      <h3 className="text-xs/4 font-bold text-slate-700 md:text-sm">
        {formatSpeciesString(wildMon.species) || "Unnamed"}
      </h3>
      <p className="font-pkmnem text-shadow-xs pr-4 text-base leading-none">
        Lv. {wildMon.level}
      </p>
    </hgroup>
    <div className="flex flex-row gap-x-2 pr-2">
      <SmallTypeBadge
        typeObjects={wildMon.typeObjects}
        className="w-13 h-5 whitespace-nowrap px-1 text-base/5 md:h-6 md:text-xl/6"
      />
    </div>
  </div>
);
const renderIcon = (wildMon: LevelScriptedEventMon) => {
  return (
    <div className="relative ml-1 overflow-hidden drop-shadow-md">
      <img
        className="aspect-square size-8 object-contain"
        src={`/icon/${wildMon.id}/icon.webp`}
      />
    </div>
  );
};

export const WildMonListContent = function WildMonListContent({
  wildMon,
}: {
  wildMon: LevelScriptedEventMon[];
}) {
  const getKey = (wildMon: LevelScriptedEventMon) => wildMon.species;
  const items = wildMon.map((wildMon) => {
    const type = pokemonDataMap.get(wildMon.id.toString())?.types;
    if (!type) {
      return;
    }
    const typeObjects = makeTypeObjects(type);
    return { ...wildMon, typeObjects };
  });
  return (
    <BaseListContent
      renderContent={WildMonListRender}
      //@ts-ignore
      renderIcon={renderIcon}
      items={items}
      emptyMessage="–"
      className="items-list-item bg-linear-to-r border-slate-200 from-cyan-500 to-blue-500 text-slate-700 ring-1 ring-sky-100 hover:bg-slate-100"
      //@ts-ignore
      getKey={getKey}
    />
  );
};

export default WildMonListContent;
