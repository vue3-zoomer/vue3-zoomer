export function getTouchPosition(event: TouchEvent) {
  const { clientX, clientY } = event.touches[0];
  return { clientX, clientY };
}
