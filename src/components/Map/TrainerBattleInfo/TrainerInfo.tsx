import { memo } from "react";
import { aiFlags } from "./aiFlags";

const rarityColors = [
  "normal-ai-flag",
  "rare-ai-flag",
  "elite-ai-flag",
  "hard-ai-flag",
];
const ittyFontStyle = Object.freeze({ fontSize: 10 });
const ittyTopStyle = Object.freeze({ top: "-0.5rem", left: "0.5rem" });
const coolTrainers = ["iriv24", "Spencer"];
const AIFlagsLabel = memo(function AIFlagsLabel({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="xs:w-40 min-w-34 shadow-xs relative flex h-full min-h-40 rounded-lg p-1 pt-4 ring-1 ring-gray-300 sm:mr-8">
      <div
        style={ittyTopStyle}
        className="absolute h-5 rounded rounded-sm bg-cyan-900 px-2 text-stone-300 ring-1 ring-zinc-500"
      >
        <p style={ittyFontStyle} className="font-calamity leading-5">
          AI Flags
        </p>
      </div>
      {children}
    </div>
  );
});

const AIFlags = ({ flags }: { flags: (keyof typeof aiFlags)[] }) => {
  if (flags.length === 0) {
    return "None";
  }

  const sortedFlags = flags
    .sort((a, b) => aiFlags[b].rarity - aiFlags[a].rarity)
    .filter((flag) => flag !== "SMART_MON_CHOICES");

  return (
    <AIFlagsLabel>
      {/* Mobile layout - vertical list */}
      <div className="font-pkmnem pkmnem-types space-y-1 text-base/4 sm:text-base/4 sm:tracking-wide md:hidden">
        {sortedFlags.map((flag, index) => {
          const bg = rarityColors[aiFlags[flag].rarity];
          return (
            <p
              className={`text-shadow-sm rounded ${bg} px-2 py-0.5`}
              key={index}
            >
              {aiFlags[flag].desc}
            </p>
          );
        })}
      </div>

      {/* Desktop layout - columns */}
      <div className="hidden md:flex md:gap-2">
        {/* First column - first 4 items */}
        <div className="font-pkmnem pkmnem-types space-y-1 text-base/4 tracking-wide">
          {sortedFlags.slice(0, 4).map((flag, index) => {
            const bg = rarityColors[aiFlags[flag].rarity];
            return (
              <p
                className={`text-shadow-sm rounded ${bg} px-2 py-0.5`}
                key={index}
              >
                {aiFlags[flag].desc}
              </p>
            );
          })}
        </div>

        {/* Second column - remaining items (if any) */}
        {sortedFlags.length > 4 && (
          <div className="font-pkmnem pkmnem-types space-y-1 text-base/4 tracking-wide">
            {sortedFlags.slice(4).map((flag, index) => {
              const bg = rarityColors[aiFlags[flag].rarity];
              return (
                <p
                  className={`text-shadow-sm rounded ${bg} px-2 py-0.5`}
                  key={index + 4}
                >
                  {aiFlags[flag].desc}
                </p>
              );
            })}
          </div>
        )}
      </div>
    </AIFlagsLabel>
  );
};
const imageStyles: React.CSSProperties = {
  imageRendering: "pixelated",
  filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.5))",
  maskImage:
    "linear-gradient(to bottom, black 0%, black 50%, transparent 100%)",
  WebkitMaskImage:
    "linear-gradient(to bottom, black 0%, black 50%, transparent 100%)",
};
const TrainerInfo = memo(function TrainerInfo({
  trainerName,
  aiFlags,
  battlePic,
}: {
  trainerName: string;
  aiFlags: string[];
  battlePic?: string;
}) {
  const boss = aiFlags.includes("OMNISCIENT");
  return (
    <div className="md:max-w-120 h-35 flex flex-row justify-between">
      {/* Trainer Image and Name */}
      <div className="sm:max-w-30 flex max-w-20 items-start gap-2">
        <div className="relative flex flex-col">
          <img
            src={battlePic}
            alt={trainerName}
            className="md:h-25 md:w-25 h-21 w-21 object-cover drop-shadow-md"
            style={imageStyles}
          />
          <div className="flex flex-row justify-between">
            <h3
              className={`font-calamity ${coolTrainers.includes(trainerName) && "rainbow-bg-text"} drop-shadow-sm ${boss && "drop-shadow-lg"} w-full text-sm font-bold text-gray-800 md:text-xl`}
            >
              {trainerName}
            </h3>
            {trainerName === "X" && (
              <p className="font-pkmnem text-xs/2 inline tracking-tight text-gray-500">
                His name is really X it&apos;s not an error
              </p>
            )}
          </div>
          {boss && (
            <div className="hard-ai-flag me-2 rounded-sm bg-blue-100 px-2.5 py-0.5 text-xs drop-shadow-sm dark:bg-blue-900 dark:text-blue-300">
              <p className="font-bold">Hard</p>
            </div>
          )}
        </div>
      </div>

      {/* AI Flags - responsive positioning */}

      <AIFlags flags={aiFlags} />
    </div>
  );
});

export default TrainerInfo;
