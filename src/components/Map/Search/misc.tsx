import { useTransition, animated as a } from "react-spring";

export const SEARCH_RESULT_SPACING = window.innerWidth < 400 ? 40 : 40;
export const SEARCH_SIZE = '15rem'
export const SEARCH_SIZE_SHRUNK = '4rem';
export const animConfigs = {
  hover: { shadow: 15 },
  initial: { scale: 1, shadow: 1 },
  click: {
    scale: 1.01,
  },
};

export const animFn = (active: boolean) =>
  active ? animConfigs.hover : animConfigs.initial;
// const clickTo = (down: boolean) => down ? {scale}

export const ErrorBanner = ({ show }: { show: boolean }) => {
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
        className="absolute left-0 right-0 z-50 mx-auto mt-2 w-fit rounded border-1 border-red-500 bg-neutral-100/80 px-4 py-2 text-center font-bold text-red-800 shadow-lg backdrop-blur-md"
      >
        <div className="flex flex-col">
          Item not buyable/given. Maybe it&apos;s a held item?
          <p className="font-pkmnem">I don&apos;t have held items yet!</p>
        </div>
      </a.div>
    ) : null,
  );
};
