type PokeballStatusIconProps = {
  state: "hidden" | "open" | "closed";
};

const stateClasses = {
  open: "pokeball-status-icon-open",
  closed: "pokeball-status-icon-closed",
};

export function PokeballStatusIcon({ state }: PokeballStatusIconProps) {
  if (state === "hidden") {
    return null;
  }

  return (
    <div
      key={state}
      aria-hidden="true"
      className={`pokeball-status-icon pixelated fixed right-0 top-0 size-6 overflow-hidden drop-shadow-md ${stateClasses[state]}`}
    >
      <img
        src="/items/poke.png"
        alt=""
        className="pokeball-status-icon-image h-18 w-9 drop-shadow-md"
      />
    </div>
  );
}
