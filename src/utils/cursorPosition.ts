export function getCursorPosition(
  event: MouseEvent,
  element: HTMLDivElement | null,
) {
  if (!element) return { relativeX: 0, relativeY: 0, isOutside: true };
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

  // Return the object with relative positions
  return { relativeX, relativeY, isOutside };
}
