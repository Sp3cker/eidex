import clsx from "clsx";
type SmallTypeBadgeProps = {
  typeObjects: { css: string; name: string }[];
  className?: string;
};
const SmallTypeBadge = ({ typeObjects, className }: SmallTypeBadgeProps) => {
  if (!typeObjects || typeObjects.length === 0) {
    return null;
  }
  return typeObjects.map(({ css, name }, index) => {
    return (
      <p
        key={index}
        className={clsx(
          "font-pkmnem pkmnem-face-shadow h-4 w-8 text-center font-bold",
          css,
          className,
        )}
      >
        {name}
      </p>
    );
  });
};

export default SmallTypeBadge;
