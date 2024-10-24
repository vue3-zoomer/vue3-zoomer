export function getTouchPosition(event: TouchEvent) {
  const { clientX, clientY } = event.touches[0];
  return { clientX, clientY };
}
export function getTouchChangedPosition(event: TouchEvent) {
  const { clientX, clientY } = event.changedTouches[0];
  return { clientX, clientY };
}
