/**
 * Cosmology and General Relativity Simulations
 * 
 * Implements approximations of spacetime curvature and gravitational lensing
 * based on general relativity principles.
 */

/**
 * Schwarzschild Metric Approximation
 * 
 * For a non-rotating black hole, the spacetime curvature can be approximated
 * by computing the deflection angle for light rays passing near a massive object.
 * 
 * Reference: Einstein's field equations, Schwarzschild solution
 */
export interface MassObject {
  x: number;
  y: number;
  mass: number; // In units of solar masses
}

/**
 * Compute spacetime curvature at a point
 * Returns a height value representing the "warping" of spacetime
 */
export function computeSpacetimeCurvature(
  x: number,
  y: number,
  massObject: MassObject
): number {
  const dx = x - massObject.x;
  const dy = y - massObject.y;
  const r = Math.sqrt(dx * dx + dy * dy);

  // Avoid singularity
  if (r < 0.1) return 1;

  // Schwarzschild metric: curvature ~ M / r
  // We use a smoothed version for visualization
  const curvature = massObject.mass / (r + 0.5);
  return Math.exp(-curvature);
}

/**
 * Gravitational Lensing
 * 
 * Light bends around massive objects. The deflection angle is approximately:
 * θ = 4GM / (c² * b)
 * where b is the impact parameter (closest approach distance)
 * 
 * We use the weak lensing approximation for simplicity.
 */
export interface LensRay {
  x: number;
  y: number;
}

/**
 * Trace a light ray through a gravitational field
 * Returns the deflected position
 */
export function traceLightRay(
  startX: number,
  startY: number,
  blackHole: MassObject,
  steps: number = 50
): LensRay[] {
  const path: LensRay[] = [];
  let x = startX;
  let y = startY;

  for (let i = 0; i < steps; i++) {
    path.push({ x, y });

    // Compute gravitational force direction
    const dx = blackHole.x - x;
    const dy = blackHole.y - y;
    const r = Math.sqrt(dx * dx + dy * dy);

    if (r < 0.5) break; // Ray has hit the black hole

    // Deflection angle (weak lensing approximation)
    const deflectionStrength = (blackHole.mass * 0.01) / (r * r);
    const angle = Math.atan2(dy, dx);

    // Update position with deflection
    const moveDistance = 0.1;
    const deflectedAngle = angle + deflectionStrength * 0.05;
    x += moveDistance * Math.cos(deflectedAngle);
    y += moveDistance * Math.sin(deflectedAngle);
  }

  return path;
}

/**
 * Compute Einstein Ring effect
 * When a light source is perfectly aligned with a massive object,
 * it appears as a ring around the object.
 */
export function computeEinsteinRing(
  blackHole: MassObject,
  sourceDistance: number
): number {
  // Einstein radius: θ_E = sqrt(4GM/c² * D_ls / (D_l * D_s))
  // Simplified: radius ~ sqrt(M * distance_ratio)
  const einsteinRadius = Math.sqrt(blackHole.mass * 0.1) * sourceDistance;
  return einsteinRadius;
}
