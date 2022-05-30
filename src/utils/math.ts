export function random(min: number = 0, max: number = 1): number {
  return min + Math.random() * (max - min);
}
export function randomInt(min: number, max: number): number {
  return Math.floor(random(min, max));
}
