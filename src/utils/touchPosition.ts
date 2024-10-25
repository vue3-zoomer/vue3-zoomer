import { PositionType } from "~/types";

export function getAbsTouchPosition(event: TouchEvent) {
  const { clientX, clientY } = event.changedTouches[0];
  const pos: PositionType = {
    left: clientX,
    top: clientY,
  };
  return pos;
}

export function getRelTouchPosition(
  event: TouchEvent,
  element: HTMLDivElement | null,
) {
  const { clientX, clientY } = event.changedTouches[0];

  const pos: PositionType = {
    left: 0,
    top: 0,
  };

  if (element) {
    const rect = element.getBoundingClientRect();
    pos.left = clientX - rect.left;
    pos.top = clientY - rect.top;
  } else {
    console.error("element not found");
    return pos;
  }
  console.log(element.clientLeft);

  return pos;
}
