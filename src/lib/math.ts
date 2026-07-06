/**
 * Mathematical Visualization Utilities
 */

/**
 * Mandelbrot Set Computation
 * 
 * For each point c in the complex plane, iterate z_{n+1} = z_n² + c
 * Count iterations until |z| > 2 (or max iterations reached)
 */
export function mandelbrotIterations(
  cx: number,
  cy: number,
  maxIterations: number = 100
): number {
  let x = 0;
  let y = 0;
  let iterations = 0;

  while (x * x + y * y <= 4 && iterations < maxIterations) {
    const xtemp = x * x - y * y + cx;
    y = 2 * x * y + cy;
    x = xtemp;
    iterations++;
  }

  return iterations;
}

/**
 * Fourier Series Decomposition
 * 
 * Decomposes a path into epicycles using Discrete Fourier Transform
 * Each epicycle is a rotating circle with frequency and amplitude
 */
export interface Epicycle {
  frequency: number;
  amplitude: number;
  phase: number;
}

export interface Point {
  x: number;
  y: number;
}

/**
 * Compute DFT coefficients for a path
 * Returns epicycles that can reconstruct the path
 */
export function computeEpicycles(path: Point[], numEpicycles: number = 50): Epicycle[] {
  if (path.length === 0) return [];

  const N = path.length;
  const epicycles: Epicycle[] = [];

  // Compute DFT coefficients
  for (let k = 0; k < Math.min(numEpicycles, N); k++) {
    let realSum = 0;
    let imagSum = 0;

    for (let n = 0; n < N; n++) {
      const angle = (-2 * Math.PI * k * n) / N;
      realSum += path[n].x * Math.cos(angle) - path[n].y * Math.sin(angle);
      imagSum += path[n].x * Math.sin(angle) + path[n].y * Math.cos(angle);
    }

    realSum /= N;
    imagSum /= N;

    const amplitude = Math.sqrt(realSum * realSum + imagSum * imagSum);
    const phase = Math.atan2(imagSum, realSum);

    if (amplitude > 0.01) {
      epicycles.push({
        frequency: k,
        amplitude,
        phase,
      });
    }
  }

  // Sort by amplitude (largest first)
  epicycles.sort((a, b) => b.amplitude - a.amplitude);

  return epicycles;
}

/**
 * Reconstruct path from epicycles at time t
 */
export function reconstructFromEpicycles(epicycles: Epicycle[], t: number): Point {
  let x = 0;
  let y = 0;

  for (const epicycle of epicycles) {
    const angle = epicycle.frequency * t + epicycle.phase;
    x += epicycle.amplitude * Math.cos(angle);
    y += epicycle.amplitude * Math.sin(angle);
  }

  return { x, y };
}
