/**
 * Machine Learning for Physics Discovery
 * 
 * Simple linear regression to discover relationships in data
 */

export interface DataPoint {
  x: number;
  y: number;
}

/**
 * Kepler's Third Law: T² ∝ a³
 * where T is orbital period and a is semi-major axis
 * 
 * We generate synthetic planetary data and use regression to discover this relationship
 */
export function generatePlanetaryData(): DataPoint[] {
  const planets = [
    { name: 'Mercury', a: 0.387, T: 0.241 },
    { name: 'Venus', a: 0.723, T: 0.615 },
    { name: 'Earth', a: 1.0, T: 1.0 },
    { name: 'Mars', a: 1.524, T: 1.881 },
    { name: 'Jupiter', a: 5.203, T: 11.86 },
    { name: 'Saturn', a: 9.537, T: 29.46 },
  ];

  return planets.map(p => ({
    x: p.a,
    y: p.T,
  }));
}

/**
 * Linear Regression
 * Fits y = mx + b to the data
 */
export interface RegressionResult {
  slope: number;
  intercept: number;
  r2: number;
}

export function linearRegression(data: DataPoint[]): RegressionResult {
  if (data.length < 2) {
    return { slope: 0, intercept: 0, r2: 0 };
  }

  const n = data.length;
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0;

  for (const point of data) {
    sumX += point.x;
    sumY += point.y;
    sumXY += point.x * point.y;
    sumX2 += point.x * point.x;
    sumY2 += point.y * point.y;
  }

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  // R² coefficient
  const meanY = sumY / n;
  let ssRes = 0, ssTot = 0;

  for (const point of data) {
    const predicted = slope * point.x + intercept;
    ssRes += (point.y - predicted) ** 2;
    ssTot += (point.y - meanY) ** 2;
  }

  const r2 = 1 - (ssRes / ssTot);

  return { slope, intercept, r2 };
}

/**
 * Power Law Regression
 * Fits y = a * x^b to the data
 * Used for Kepler's Law: T² = k * a³
 */
export interface PowerLawResult {
  coefficient: number;
  exponent: number;
  r2: number;
}

export function powerLawRegression(data: DataPoint[]): PowerLawResult {
  if (data.length < 2) {
    return { coefficient: 0, exponent: 0, r2: 0 };
  }

  // Transform to log scale: log(y) = log(a) + b*log(x)
  const logData = data.map(p => ({
    x: Math.log(p.x),
    y: Math.log(p.y),
  }));

  const regression = linearRegression(logData);
  const coefficient = Math.exp(regression.intercept);
  const exponent = regression.slope;

  return {
    coefficient,
    exponent,
    r2: regression.r2,
  };
}

/**
 * Generate predictions from regression
 */
export function predictLinear(x: number, result: RegressionResult): number {
  return result.slope * x + result.intercept;
}

export function predictPowerLaw(x: number, result: PowerLawResult): number {
  return result.coefficient * Math.pow(x, result.exponent);
}
