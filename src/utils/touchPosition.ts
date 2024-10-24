export function getTouchPosition(event: TouchEvent) {
  const { clientX: clientLeft, clientY: clientTop } = event.changedTouches[0];
  return { clientLeft, clientTop };
}
