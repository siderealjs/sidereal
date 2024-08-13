import { AstroDate } from "@models/AstroDate";

/**
 * Get eccentric anomaly (E) solving the Kepler equation E = M + e*sinE with Newton-Raphson Method
 *
 * @param {number} M - Mean Anomaly at certain date
 * @param {number} e - Eccentricity
 * @param {number} tolerance
 * @param {number} maxIterations
 * @returns {number}
 */
export const calcEccentricAnomaly = (
  M: number,
  e: number,
  tolerance = 1e-6,
  maxIterations = 1000
): number => {
  let E = M; // Initialize eccentric anomaly with mean anomaly
  let iteration = 0;

  while (iteration < maxIterations) {
    // Calcolate new value for E
    const E_new = E + (M - (E - e * Math.sin(E))) / (1 - e * Math.cos(E));

    // Verify convergence
    if (Math.abs(E_new - E) < tolerance) {
      return E_new;
    }

    E = E_new;
    iteration++;
  }

  // If cannot find convergence, throw error
  throw new Error("Kepler equation did not converge");
};

/**
 * Calculate true anomaly (v)
 *
 * @param {number} E - Eccentric anomaly
 * @param {number} e - Orbit eccentricity (must be < 0 and >= 1)
 * @returns
 */
export const calcTrueAnomaly = (E: number, e: number): number => {
  if (e < 0 || e >= 1) {
    // console.warn("Not valid anomaly e=", e);
    // TODO: throw error here
    return 0;
  }

  return (
    2 *
    Math.atan2(
      Math.sqrt(1 + e) * Math.sin(E / 2),
      Math.sqrt(1 - e) * Math.cos(E / 2)
    )
  );
};

/**
 * 
 * @param {number} M0 - Mean anomaly on the day 2000-01-01
 * @param {number} n - Mean motion (constant)
 * @param {Date} date - Date for which to calculate the mean anomaly
 * @returns 
 */
export const calcMeanAnomalyAtDate = (
  M0: number,
  n: number,
  date: AstroDate
): number => {

  const deltaT = date.daysSinceEpoch('J2000');

  // Calcolate mean anomaly
  const M = M0 + n * deltaT;

  // Normalize between 0 e 2PI
  return M % (2 * Math.PI);
};
