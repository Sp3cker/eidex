type EvolutionProps = {
  onClick: () => void;
  alt: string;
  sprite: string;
  requirements?: string;
};
const Evolution = ({ onClick, alt, sprite, requirements = "" }: EvolutionProps) => {
  return (
    <div
      className="my-1 rounded-md bg-neutral-700 p-3 text-center"
      onClick={onClick}
    >
      <img
        src={sprite}
        alt={alt}
        className="h-[48px] w-[48px] object-contain"
      />
      <p className="text-xs md:text-sm text-center max-w-20">{requirements}</p>
    </div>
  );
};

export default Evolution;
