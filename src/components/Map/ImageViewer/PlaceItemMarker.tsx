import React from "react";
import { animated } from "@react-spring/web";
import { ItemWithCoords } from "@/data/map";
import { getItemSpriteStyle } from "@/utils/itemSprites";

interface PickupItemMarkerProps {
  item: ItemWithCoords;
  scaleX: number;
  scaleY: number;
  spring: any; // Type this according to your spring properties
}

export const PickupItemMarker: React.FC<PickupItemMarkerProps> = ({
  item,
  scaleX,
  scaleY,
  spring,
}) => {
  return (
    <animated.div
      className="pickup-item-marker"
      style={{
        ...spring,
        left: (item.coords[0] * 16 + 8) * scaleX, // Apply scale to X coordinate, +8 for center of 16px tile
        top: (item.coords[1] * 16 + 8) * scaleY, // Apply scale to Y coordinate, +8 for center of 16px tile
      }}
    >
      <div className="pickup-item-tooltip cool-font">
        <div
          className="rendering-pixelated"
          style={getItemSpriteStyle(item.id, 16) || {}}
        />
        <p className="item-name pkmnem-face-shadow">{item.name || "Item"}</p>
      </div>
      {/* Pointer triangle */}
      <div className="pickup-item-arrow" />
    </animated.div>
  );
};

export default PickupItemMarker;
