import type { LightPosition } from "@/types";

export function sphereToCartesian(
  azimuth: number,
  elevation: number,
  radius = 1
): [number, number, number] {
  const az = (azimuth * Math.PI) / 180;
  const el = (elevation * Math.PI) / 180;
  const x = radius * Math.cos(el) * Math.sin(az);
  const y = radius * Math.sin(el);
  const z = radius * Math.cos(el) * Math.cos(az);
  return [x, y, z];
}

export function cartesianToSphere(
  x: number,
  y: number,
  z: number
): LightPosition {
  const r = Math.sqrt(x * x + y * y + z * z);
  if (r === 0) return { azimuth: 0, elevation: 0 };
  const elevation = Math.asin(y / r) * (180 / Math.PI);
  const azimuth = Math.atan2(x, z) * (180 / Math.PI);
  return { azimuth, elevation };
}

export function directionLabel(pos: LightPosition): string {
  const { azimuth, elevation } = pos;

  let vertical = "";
  if (elevation > 30) vertical = "upper";
  else if (elevation < -30) vertical = "lower";

  let horizontal = "";
  const a = ((azimuth % 360) + 360) % 360;
  if (a >= 315 || a < 45) horizontal = "front";
  else if (a >= 45 && a < 135) horizontal = "right";
  else if (a >= 135 && a < 225) horizontal = "back";
  else horizontal = "left";

  if (elevation > 70) return "directly above";
  if (elevation < -70) return "directly below";

  return vertical ? `${vertical}-${horizontal}` : horizontal;
}

export function raySphereIntersect(
  ox: number,
  oy: number,
  oz: number,
  dx: number,
  dy: number,
  dz: number,
  radius: number
): [number, number, number] | null {
  const a = dx * dx + dy * dy + dz * dz;
  const b = 2 * (ox * dx + oy * dy + oz * dz);
  const c = ox * ox + oy * oy + oz * oz - radius * radius;
  const disc = b * b - 4 * a * c;
  if (disc < 0) return null;
  const t = (-b - Math.sqrt(disc)) / (2 * a);
  if (t < 0) return null;
  return [ox + t * dx, oy + t * dy, oz + t * dz];
}
