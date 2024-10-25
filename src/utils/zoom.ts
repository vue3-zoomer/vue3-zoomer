import { PositionType } from "~/types";

export function calZoomedImgOffset(
  pos: PositionType,
  element: HTMLDivElement | null,
  scale: number,
) {
  if (element) {
    const w = element.clientWidth;
    const h = element.clientHeight;

    // Calculate the ratio of the mouse position relative to the element's dimensions
    const xRatio = pos.left / w;
    const yRatio = pos.top / h;

    // Calculate the dimensions of the zoomed image
    const zoomedWidth = w * scale;
    const zoomedHeight = h * scale;

    let left = -(zoomedWidth - w) * xRatio;
    let top = -(zoomedHeight - h) * yRatio;

    // Ensure left position does not move the image out of bounds
    left = Math.max(Math.min(left, 0), w - zoomedWidth);

    // Ensure top position does not move the image out of bounds
    top = Math.max(Math.min(top, 0), h - zoomedHeight);
    return {
      left,
      top,
    } as PositionType;
  } else {
    console.error("element not found");
    return { left: 0, top: 0 } as PositionType;
  }
}

export function calcDragOffset(
  pos1: PositionType,
  pos2: PositionType,
  oldOffset: PositionType,
  w: number,
  h: number,
  scale: number,
) {
  const maxYOffset = h - h * scale;

  const maxXOffset = w - w * scale;

  const dx = pos2.left - pos1.left;
  const dy = pos2.top - pos1.top;

  const offset = {
    left: Math.max(Math.min(oldOffset.left + dx, 0), maxXOffset),
    top: Math.max(Math.min(oldOffset.top + dy, 0), maxYOffset),
  };

  return offset;
}
