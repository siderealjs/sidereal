import { daysBetweenDates } from "../utils/dates";

export const calcEccentricAnomaly = (
  M: number,
  e: number,
  tolerance = 1e-6,
  maxIterations = 1000
) => {
  let E = M; // Inizializza l'anomalia eccentrica con l'anomalia media
  let iteration = 0;

  while (iteration < maxIterations) {
    // Calcola il nuovo valore di E
    const E_new = E + (M - (E - e * Math.sin(E))) / (1 - e * Math.cos(E));

    // Verifica la convergenza
    if (Math.abs(E_new - E) < tolerance) {
      return E_new;
    }

    E = E_new;
    iteration++;
  }

  // In caso di mancata convergenza, lancia un errore
  throw new Error("Kepler equation did not converge");
};

export const calcTrueAnomaly = (E: number, e: number) => {
  return (
    2 *
    Math.atan2(
      Math.sqrt(1 + e) * Math.sin(E / 2),
      Math.sqrt(1 - e) * Math.cos(E / 2)
    )
  );
};

export const calcMeanAnomalyAtDate = (M0: number, n: number, date: Date) => {
  const julianEpoch = new Date("2000-01-01");
  const deltaT = daysBetweenDates(julianEpoch, date);

  console.log('001:: delta giorni', deltaT)
  // Calcola l'anomalia media
  const M = M0 + n * deltaT;

  console.log('002:: non normalizzata M', M);
  
  const finalM = M % (2 * Math.PI);

  // const finalM = M - Math.floor(M / (2 * Math.PI)) * 2 * Math.PI;

  return finalM;
};
