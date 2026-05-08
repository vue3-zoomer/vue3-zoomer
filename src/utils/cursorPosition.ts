import type { PositionType } from "~/types";

export function getRelCursorPosition(
  event: MouseEvent,
  element: HTMLDivElement | null,
  rotate: number = 0,
) {
  if (element) {
    // Get the bounding rectangle of the element (screen-space, affected by rotation)
    const rect = element.getBoundingClientRect();

    // Calculate the relative X and Y position within the bounding rect
    const relativeX = event.clientX - rect.left;
    const relativeY = event.clientY - rect.top;

    // Determine if the mouse is outside the element
    const isOutside =
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom;

    // Convert from bounding-rect-relative screen coords to element-local coords
    const normalizedAngle = ((rotate % 360) + 360) % 360;
    let pos: PositionType;

    if (normalizedAngle === 0) {
      pos = { left: relativeX, top: relativeY };
    } else {
      const w = element.clientWidth;
      const h = element.clientHeight;

      // Position relative to center of bounding rect (screen space)
      const screenDx = relativeX - rect.width / 2;
      const screenDy = relativeY - rect.height / 2;

      // Inverse rotate to get element-local coordinates relative to center
      let localDx: number, localDy: number;
      switch (normalizedAngle) {
        case 90:
          localDx = screenDy;
          localDy = -screenDx;
          break;
        case 180:
          localDx = -screenDx;
          localDy = -screenDy;
          break;
        case 270:
          localDx = -screenDy;
          localDy = screenDx;
          break;
        default: {
          const rad = (-rotate * Math.PI) / 180;
          const cos = Math.cos(rad);
          const sin = Math.sin(rad);
          localDx = screenDx * cos - screenDy * sin;
          localDy = screenDx * sin + screenDy * cos;
          break;
        }
      }

      pos = { left: localDx + w / 2, top: localDy + h / 2 };
    }

    return {
      pos,
      isOutside,
    };
  }

  return {
    pos: { left: 0, top: 0 } as PositionType,
    isOutside: true,
  };
}
