import { useTransition, animated as a } from "@react-spring/web";

export const SEARCH_RESULT_SPACING = window.innerWidth < 400 ? 40 : 40;
export const SEARCH_SIZE = "15rem";
export const SEARCH_SIZE_SHRUNK = "4rem";
export const animConfigs = Object.freeze({
  hover: { shadow: 15 },
  initial: { scale: 1, shadow: 1 },
  click: {
    scale: 1.01,
  },
});

export const animFn = (active: boolean) =>
  active ? animConfigs.hover : animConfigs.initial;
// const clickTo = (down: boolean) => down ? {scale}

export const ErrorBanner = ({
  show,
  type,
  species,
}: {
  show: boolean;
  type: "held" | "error";
  species?: string[];
}) => {
  const transitions = useTransition(show, {
    from: { opacity: 0, translateY: -40 },
    enter: { opacity: 1, translateY: 0 },
    leave: { opacity: 0, translateY: -40 },
    config: { tension: 300, friction: 30 },
  });
  return transitions((style, item) =>
    item ? (
      <a.div
        style={style}
        className={`absolute left-0 right-0 z-50 mx-auto mt-2 w-fit rounded border bg-neutral-100/80 px-4 py-2 text-center font-bold shadow-lg backdrop-blur-md ${
          type === "held"
            ? "border-blue-500 text-blue-800"
            : "border-red-500 text-red-800"
        }`}
      >
        {type === "held" ? (
          <div className="flex flex-col gap-2">
            <h3>Item is held by:</h3>
            <ul>
              {species?.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        ) : (
          <h3>Item not available in game.</h3>
        )}
      </a.div>
    ) : null,
  );
};
