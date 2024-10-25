import { PositionType } from "~/types";

export function getRelCursorPosition(
  event: MouseEvent,
  element: HTMLDivElement | null,
) {
  if (element) {
    // Get the bounding rectangle of the element
    const rect = element.getBoundingClientRect();

    // Calculate the relative X and Y position
    const relativeX = event.clientX - rect.left;
    const relativeY = event.clientY - rect.top;

    // Determine if the mouse is outside the element
    const isOutside =
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom;

    const pos = { left: relativeX, top: relativeY } as PositionType;
    return {
      pos,
      isOutside,
    };
  } else {
    return {
      pos: { left: 0, top: 0 } as PositionType,
      isOutside: true,
    };
  }
}
