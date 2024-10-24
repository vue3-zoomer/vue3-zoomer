export function getTouchPosition(event: TouchEvent) {
  const { clientX, clientY } = event.changedTouches[0];
  return { clientX, clientY };
}
