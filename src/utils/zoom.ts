export function calZoomedImgOffset(
  x: number,
  y: number,
  w: number,
  h: number,
  scale: number,
) {
  // Calculate the ratio of the mouse position relative to the element's dimensions
  const xRatio = x / w;
  const yRatio = y / h;

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
  };
}
