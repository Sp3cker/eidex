import React from "react";
import { config, useSpring, animated } from "@react-spring/web";
const CameraIcon = React.memo(function CameraIcon({
  setViewingImage,
}: {
  setViewingImage: (viewing: boolean) => void;
}) {
  const [buttonSpring, buttonSpringApi] = useSpring(
    {
      rotate: -30,

      config: config.gentle,
    },
    [],
  );
  const handleImageClick = () => {
    setViewingImage(true);
  };
  const wiggleIcon = React.useCallback(() => {
    buttonSpringApi.start({ from: { rotate: 25 }, rotate: -30, reset: true });
  }, []);
  return (
    <button
      onMouseEnter={wiggleIcon}
      onClick={handleImageClick}
      className="cursor-pointer rounded-md transition-all hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 active:bg-gray-300"
    >
      <animated.img
        src="/camera.webp"
        alt=""
        className="block h-10 w-10"
        style={{
          transform: buttonSpring.rotate
            .to({
              range: [0, 10, 25, 50, -50],
              output: [0, -4, 4, 2, 0],
            })
            .to((r) => `rotate(${r}deg)`),
          filter: `drop-shadow(0px 0px 2px rgba(0, 0, 0, 0.3))`,
        }}
      />
    </button>
  );
});
export default CameraIcon;
