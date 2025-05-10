import { useEffect, useRef, useState } from "react";
import { useSpring, animated, useSpringValue } from "react-spring";
import { animConfigs } from "../../utils/animConfigs";

const PokemonSprite = ({
  spriteIndex,
  alt,
  isOpen,
}: {
  spriteIndex: number;
  alt: string;
  isOpen: boolean;
}) => {
  const src = `/upscaled/${spriteIndex}/anim_front.webp`;
  // const [state, toggle] = useState(false);
  console.log(spriteIndex)
  const [animFrames, animConfig] = animConfigs(spriteIndex);
  const [frame, setFrame] = useState(0);
  // const [ref] = useRef(null);
  const [isRunning, setIsRunning] = useState(false);

  const [springProps] = useSpring(
    () => ({
      // onChange: ({value}) => console.log(value),
      // Translate to show correct frame (assuming 150px wide frames)
      // frameTick: frame,
      // x: frame === 0 ? 0 : 1, // Shift left for state 1
      // scale: frame === 1 ? 1.2 : 1, // Scale up for state 1
      // loop: true,
      ...animConfig(frame),

      // config: (key) => ({
        // Instant for translate3d, smooth for scale/rotate
        // duration: key === "frameTick" ? 0 : undefined,
        // tension: 300,
        // friction: 20,
      // }),
    }),
    [frame, animFrames],
  );

  // Handle sequence on click
  const handleClick = () => {
    if (isRunning) return; // Prevent multiple clicks during sequence
    setIsRunning(true);
    setFrame(0); // Reset to first state
  };
  // console.log(animFrames);
  // Run sequence once
  useEffect(() => {
    // if (!isRunning) return;
    let timeoutId;
    let isMounted = true;
    const runSequence = (index = 0) => {
      if (!isMounted || index >= animFrames.length) {
        if (isMounted) setIsRunning(false); // End sequence
        return;
      }
      const [nextState, holdDuration] = animFrames[index];
      console.log("state", nextState);
      setFrame(nextState);
      timeoutId = setTimeout(
        () => {
          runSequence(index + 1); // Move to next state
        },
        (holdDuration * 1000) / 60,
      ); // holdDuration * 10 ms
    };

    runSequence(0);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [isRunning, animFrames]);

  return (
    <animated.div className={`sprite-box`} onClick={handleClick}>
      <animated.img
        // ref={ref}
        src={src}
        alt={alt}
        className="pokemon-sprite"
        style={{
          rotate: springProps.rotate,
          // translateX: springProps.x,

          ...springProps,
          // scale: springProps.scale,
          translateY: frame === 0 ? "0px" : "-50%",
          // opacity: springProps.rotate.to({ range: [0, 1], output: [0.3, 1] }),
          // scaleX: scale.to({
          //   range: [0, 0.25, 0.35, 0.45, 0.55, 0.65, 0.75, 1],
          //   output: [1, 0.97, 0.9, 1.1, 0.9, 1.1, 1.03, 1],
          // }),
          // transform: transSpring
          //   .to({
          //     range: [0, 1],
          //     output: [0, -384],
          //   })
          //   .to((value) => {
          //     return `translate3d(0,${value}px, 0)`;
          //   }),
        }}
      />
    </animated.div>
  );
};

export default PokemonSprite;
