import react, { useState } from "react";
import { useSpring, animated, easings } from "react-spring";

const PokemonSprite = ({
  spriteIndex,
  alt,
  isOpen,
}: {
  spriteIndex: number;
  alt: string;
  isOpen: boolean;
}) => {
  const src = `/upscaled/${32}/anim_front.webp`;
  const [state, toggle] = useState(false);
  const { y, scale } = useSpring({
    from: { y: 0, scale: 0 },

    scale: state ? 1 : 0,
    config: (key: string) => {
      if (key === "y") {
        return {
          progress: 50,
          easings: easings.steps(2),
          duration: 1000,
        };
      }
      return { duration: 1000 };
    },
    loop: (key: string) => {
      if (key === "y") {
        return true;
      }
      return false;
    },
  });
  return (
    <div className="sprite-box" onClick={() => toggle(!state)}>
      <animated.img
        src={src}
        alt={alt}
        className="pokemon-sprite"
        style={{
          opacity: scale.to({ range: [0, 1], output: [0.3, 1] }),
          scale: scale.to({
            range: [0, 0.25, 0.35, 0.45, 0.55, 0.65, 0.75, 1],
            output: [1, 0.97, 0.9, 1.1, 0.9, 1.1, 1.03, 1],
          }),
          transform: y
            .to({
              easing: easings.steps(3),
              range: [0, 50, 100],
              output: [0, 100, 0],
            })
            .to((value) => {
              console.log(value);
              return `translate3d(0,-${value}%, 0)`;
            }),
        }}
      />
    </div>
  );
};

export default PokemonSprite;
