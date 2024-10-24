import { PositionType } from "~/types";

export const pos2offset = (position: PositionType, scale: number) => {
  return {
    left: -position.left * scale,
    top: -position.top * scale,
  };
};

export const offset2pos = (offset: PositionType, scale: number) => {
  return {
    left: -offset.left / scale,
    top: -offset.top / scale,
  };
};
