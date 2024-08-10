import { Angle } from "@models/position/Angle";

export function calcPhaseAngle(
  distanceBodyObject: number,
  distanceBodySun: number,
  distanceObserverSun: number
): Angle {
  const dBO2 = distanceBodyObject * distanceBodyObject;
  const dBS2 = distanceBodySun * distanceBodySun;
  const dOS2 = distanceObserverSun * distanceObserverSun;

  // Calcola il coseno dell'angolo alpha
  const cosAlpha =
    (dBO2 + dBS2 - dOS2) / (2 * distanceBodyObject * distanceBodySun);

  // Calcola l'angolo in radianti usando l'inverso del coseno
  const alpha = Math.acos(cosAlpha);

  return new Angle(alpha);
}

export function calculateQ(a: number) {
  // Converti l'angolo da gradi a radianti
  const aRadians = a * (Math.PI / 180);

  // Calcola il valore di q
  const q =
    (2 / 3) *
    ((1 - a / 180) * Math.cos(aRadians) + (1 / Math.PI) * Math.sin(aRadians));

  return q;
}

export function calculateQemp(name: string, alpha: number) {
  if (name === "venus") {
    if (alpha > 0 && alpha <= 163.7) {
      // Apply the first formula
      return (
        -1.044e-3 * alpha +
        3.687e-4 * Math.pow(alpha, 2) -
        2.814e-6 * Math.pow(alpha, 3) +
        8.938e-9 * Math.pow(alpha, 4)
      );
    } else if (alpha > 163.7 && alpha < 179) {
      // Apply the second formula
      return 240.44228 - 2.81914 * alpha + 8.39034e-3 * Math.pow(alpha, 2);
    }
  } else if (name === "mars") {
    // Converti l'angolo da gradi a radianti
    if (alpha > 0 && alpha <= 50) {
      return 0.02267 * alpha - 0.0001302 * alpha * alpha;
    } else {
      // Calcola il valore usando l'espressione fornita
      return 1.234 - 0.02573 * alpha + 0.0003445 * Math.pow(alpha, 2);
    }
  }
}
