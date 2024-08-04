import { OrbitalParams } from "./../types/OrbitalParams.type";



export const convertCoordsEclipticToEquatorial = (
  xEcl: number,
  yEcl: number,
  zEcl: number
) => {
  // Converti in coordinate equatoriali
  const epsilon = 0.4091; // inclinazione dell'eclittica in radianti

  const cosEpsilon = Math.cos(epsilon);
  const sinEpsilon = Math.sin(epsilon);

  const x_eq = xEcl;
  const y_eq = cosEpsilon * yEcl - sinEpsilon * zEcl;
  const z_eq = sinEpsilon * yEcl + cosEpsilon * zEcl;

  return {
    xEq: x_eq,
    yEq: y_eq,
    zEq: z_eq,
  };
};

function convertiRAinOrari(rad) {
  // Converti RA da radianti a gradi
  const gradi = (1 * rad * 180) / Math.PI;

  // Converti gradi in ore
  let ore = Math.floor(gradi / 15);
  let minuti = Math.floor((gradi % 15) * 4);
  let secondi = Math.round(((gradi % 15) * 4 - minuti) * 60);

  // Assicurati che ore siano nel range 0-23
  ore = (ore + 24) % 24;
  // Assicurati che minuti e secondi siano nel range 0-59
  if (secondi === 60) {
    secondi = 0;
    minuti++;
  }
  if (minuti === 60) {
    minuti = 0;
    ore++;
  }

  return `${ore.toString().padStart(2, "0")}h ${minuti
    .toString()
    .padStart(2, "0")}m ${secondi.toString().padStart(2, "0")}s`;
}

/**
 * Converte un valore in radianti in un formato gradi, minuti e secondi.
 * @param {number} rad - Valore in radianti.
 * @returns {string} - Formato "+dd° mm’ ss”".
 */
function convertiDECinGradi(radians) {
  // Converti DEC da radianti a gradi
  // const gradi = (rad * 180) / Math.PI;

  // // Determina il segno per il formato
  // const segno = gradi >= 0 ? "+" : "-";
  // const gradiAssoluti = Math.abs(gradi);

  // // Calcola gradi, minuti e secondi
  // const gradiInt = Math.floor(gradiAssoluti);
  // const minuti = Math.floor((gradiAssoluti - gradiInt) * 60);
  // const secondi = Math.round(((gradiAssoluti - gradiInt) * 60 - minuti) * 60);

  // return `${segno}${gradiInt.toString().padStart(2, "0")}° ${minuti
  //   .toString()
  //   .padStart(2, "0")}’ ${secondi.toString().padStart(2, "0")}”`;


  const degrees = -1 * radians * (180 / Math.PI);

  // Ottieni il segno e il valore assoluto dei gradi
  const sign = degrees < 0 ? '-' : '+';
  const absDegrees = Math.abs(degrees);

  // Ottieni i gradi, minuti e secondi
  const intDegrees = Math.floor(absDegrees);
  const minutes = (absDegrees - intDegrees) * 60;
  const intMinutes = Math.floor(minutes);
  const seconds = (minutes - intMinutes) * 60;

  // Formatta i minuti e i secondi come numeri interi
  const formattedMinutes = intMinutes.toString().padStart(2, '0');
  const formattedSeconds = seconds.toFixed(2).toString().padStart(2, '0');

  return `${sign}${intDegrees}° ${formattedMinutes}' ${formattedSeconds}"`;
}

/**
 * Calcola la Declinazione (DEC) e l'Ascensione Retta (RA) e converte in formato leggibile.
 * @param {number} x_eq - Coordinata x nel sistema equatoriale.
 * @param {number} y_eq - Coordinata y nel sistema equatoriale.
 * @param {number} z_eq - Coordinata z nel sistema equatoriale.
 * @returns {Object} - Oggetto contenente RA e DEC nel formato leggibile.
 */
export function calcolaRADEC(x_eq, y_eq, z_eq) {
  // Calcola la distanza radiale r
  const r = Math.sqrt(x_eq * x_eq + y_eq * y_eq + z_eq * z_eq);

  // Calcola la Declinazione (DEC) in radianti
  const DEC = Math.asin(z_eq / r);

  // Calcola l'Ascensione Retta (RA) in radianti
  let RA = Math.atan2(y_eq, x_eq);

  // Normalizza RA a [0, 2π)
  RA = (RA + 2 * Math.PI) % (2 * Math.PI);

  // Correggi RA se è negativo
  if (RA < 0) {
    RA += 2 * Math.PI;
  }

  console.log("prima di formattare, ", RA, DEC);
  // Converti RA e DEC in formato leggibile
  const raFormattato = convertiRAinOrari(RA);
  const decFormattato = convertiDECinGradi(DEC);

  return {
    RA: raFormattato,
    DEC: decFormattato,
  };
}

export function calculateCoordinates(r, v, orbitalParams) {
  const { i, Ω, ω } = orbitalParams;

  // Calculate position in orbital plane
  const xOrb = r * Math.cos(ω + v);
  const yOrb = r * Math.sin(ω + v);

  // Convert to 3D coordinates
  const x = xOrb * (Math.cos(Ω) - Math.sin(Ω) * Math.cos(i));
  const y = xOrb * (Math.sin(Ω) + Math.cos(Ω) * Math.cos(i));
  const z = yOrb * Math.sin(i);

  return { x, y, z };
}

// export const calcCelstialParams = (v, orbitalParams) => {
//   const { e, ω, a, Ω, i } = orbitalParams;

//   const r = (a * (1 - e * e)) / (1 + e * Math.cos(v));

//   const xOrb = r * Math.cos(ω + v);
//   const yOrb = r * Math.sin(ω + v);

//   const x = xOrb * (Math.cos(Ω) - Math.sin(Ω) * Math.cos(i));
//   const y = xOrb * (Math.sin(Ω) + Math.cos(Ω) * Math.cos(i));
//   const z = yOrb * Math.sin(i);

//   const d = Math.sqrt(x * x + y * y);
//   const declination = Math.atan2(z, d);
//   const rightAscension = Math.atan2(y, x);

//   console.log('prima di conv', declination, rightAscension);

//   const raFormattato = convertiRAinOrari(rightAscension);
//   const decFormattato = convertiDECinGradi(declination);

//   return {
//     RA: raFormattato,
//     DEC: decFormattato,
//   };

// };

export const orbitalCoordsWithTrueAnomaly = (v, r, orbitalParams) => {
  // const xOrb = r * Math.cos(v);
  // const yOrb = r * Math.sin(v);
  const { e, ω, a, Ω, i } = orbitalParams;

  const xOrb = r * Math.cos(ω + v);
  const yOrb = r * Math.sin(ω + v);

  return { xOrb, yOrb };
};

export const maremma = (v, orbitalParams) => {
  const { e, ω, a, Ω, i } = orbitalParams;
  const epsilon = 23.44;

  // Calcolare la distanza radiale
  const r = (a * (1 - e * e)) / (1 + e * Math.cos(v));

  // Coordinate in termini del sistema eclittico
  const x =
    r *
    (Math.cos(ω + v) * Math.cos(Ω) -
      Math.sin(ω + v) * Math.sin(Ω) * Math.cos(i));
  const y =
    r *
    (Math.cos(ω + v) * Math.sin(Ω) +
      Math.sin(ω + v) * Math.cos(Ω) * Math.cos(i));
  const z = r * (Math.sin(ω + v) * Math.sin(i));

  // Coordinate in termini di sistema equatoriale
  // coordinate spaziali tridimensionali (x, y, z) nel sistema di riferimento equatoriale.
  // cordinate equatoriali cartesiane
  const xEq = x;
  const yEq = y * Math.cos(epsilon) - z * Math.sin(epsilon);
  const zEq = y * Math.sin(epsilon) + z * Math.cos(epsilon);

  // Calcolare l'ascensione retta e la declinazione
  const α = Math.atan2(yEq, xEq);
  const δ = Math.asin(zEq / Math.sqrt(xEq * xEq + yEq * yEq + zEq * zEq));

  console.log("PRE REV", xEq, yEq, zEq);
  return { α, δ };
  // return {
  //   alpha: convertiRAinOrari(α), // Ascensione retta in radianti
  //   declination: convertiDECinGradi(δ) // Declinazione in radianti
  // };
};

export const reverseDECandRA = (α, δ) => {
  const r = 1.4336214122696722;

  const y = r * Math.cos(δ) * Math.sin(α);
  const x = r * Math.cos(δ) * Math.cos(α);

  const z = r * Math.sin(δ);

  console.log("REVERSED,", x, y, z);
};

export const transformEquatorialToEcliptic = (xeq, yeq, zeq) => {
  const ε = 0.40911;

  const xecl = xeq;
  const yecl = yeq * Math.cos(ε) - zeq * Math.sin(ε);
  const zecl = yeq * Math.sin(ε) + zeq * Math.cos(ε);
};

export const ecliptictToRaDec = (x_e, y_e, z_e) => {
  const epsilon = 0.40911;

  // Calcolare l'ascensione retta (RA) in radianti
  let α = Math.atan2(
    y_e * Math.cos(epsilon) - z_e * Math.sin(epsilon),
    x_e
  );
  
  // Calcolare la declinazione (DEC) in radianti
  let δ = Math.atan2(
    z_e * Math.cos(epsilon) + y_e * Math.sin(epsilon),
    Math.sqrt(x_e * x_e + (y_e * Math.cos(epsilon) - z_e * Math.sin(epsilon)) ** 2)
  );

  if (α < 0) {
    α += 2 * Math.PI;
  }

  // Convertire RA e DEC da radianti a gradi se necessario
  let α_degrees = convertiRAinOrari(α);
  let δ_degrees = convertiDECinGradi(δ);

  return { α, δ, α_degrees, δ_degrees };
};


export const convertCoordsOrbitalToEcliptic = (
  xOrb: number,
  yOrb: number,
  orbitalParams: OrbitalParams
) => {
  const { i, Ω, ω } = orbitalParams;
  const xEcl =
    xOrb *
      (Math.cos(Ω) * Math.cos(ω) - Math.sin(Ω) * Math.sin(ω) * Math.cos(i)) -
    yOrb *
      (Math.sin(Ω) * Math.cos(ω) + Math.cos(Ω) * Math.sin(ω) * Math.cos(i));

  const yEcl =
    xOrb *
      (Math.cos(Ω) * Math.sin(ω) + Math.sin(Ω) * Math.cos(ω) * Math.cos(i)) +
    yOrb *
      (Math.cos(Ω) * Math.cos(ω) - Math.sin(Ω) * Math.sin(ω) * Math.cos(i));

  const zEcl =
    xOrb * (Math.sin(ω) * Math.sin(i)) + yOrb * (Math.cos(ω) * Math.sin(i));

  return { xEcl, yEcl, zEcl };
};

export const convertCoordsOrbitalToEcliptic2 = (
  xOrb: number,
  yOrb: number,
  orbitalParams: OrbitalParams
) => {
  const { i, Ω, ω } = orbitalParams;

  const xDoublePrime = xOrb * Math.cos(ω) - yOrb * Math.sin(ω);
  const yDoublePrime = xOrb * Math.sin(ω) + yOrb * Math.cos(ω);
  const zDoublePrime = 0;

  // Calcolare le coordinate dopo la rotazione attorno all'asse x di -i
  const xTriplePrime = xDoublePrime;
  const yTriplePrime = yDoublePrime * Math.cos(i) - zDoublePrime * Math.sin(i);
  const zTriplePrime = yDoublePrime * Math.sin(i) + zDoublePrime * Math.cos(i);

  // Calcolare le coordinate finali dopo la rotazione attorno all'asse z di -Ω
  const xEcl = xTriplePrime * Math.cos(Ω) - yTriplePrime * Math.sin(Ω);
  const yEcl = xTriplePrime * Math.sin(Ω) + yTriplePrime * Math.cos(Ω);
  const zEcl = zTriplePrime;

  return { xEcl, yEcl, zEcl };
};

export function transformToEcliptic(x, y, orbitalParams) {
  // Converti gradi a radianti
  const { ω, Ω, i } = orbitalParams;

  
  // Rotazione attorno all'asse z (nodo ascendente)
  const x1 = x * Math.cos(Ω) + y * Math.sin(Ω);
  const y1 = -x * Math.sin(Ω) + y * Math.cos(Ω);
  const z1 = 0;

  // Rotazione attorno all'asse x (inclinazione)
  const x2 = x1;
  const y2 = y1 * Math.cos(i) - z1 * Math.sin(i);
  const z2 = y1 * Math.sin(i) + z1 * Math.cos(i);

  // Rotazione attorno all'asse z (argomento del perielio)
  const xE = x2 * Math.cos(ω) - y2 * Math.sin(ω);
  const yE = x2 * Math.sin(ω) + y2 * Math.cos(ω);
  const zE = z2;

  return { xEcl: xE, yEcl: yE, zEcl: zE };
}

export function transformToEcliptic4(xOrb, yOrb, orbitalParams) {
  // Converti gradi a radianti
  const { ω, Ω, i } = orbitalParams;

  
  const x1 = xOrb * Math.cos(ω) - yOrb * Math.sin(ω);
  const y1 = xOrb * Math.sin(ω) + yOrb * Math.cos(ω);
  const z1 = 0; // z non cambia durante questa rotazione

  // Rotazione attorno all'asse x di -i (inclinazione)
  const x2 = x1;
  const y2 = y1 * Math.cos(i) - z1 * Math.sin(i);
  const z2 = y1 * Math.sin(i) + z1 * Math.cos(i);

  // Rotazione attorno all'asse z di -Ω (nodo ascendente)
  const xEcl = x2 * Math.cos(Ω) - y2 * Math.sin(Ω);
  const yEcl = x2 * Math.sin(Ω) + y2 * Math.cos(Ω);
  const zEcl = z2; // z non cambia durante questa rotazione

  return { xEcl, yEcl, zEcl };
}