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
  const sign = degrees < 0 ? "-" : "+";
  const absDegrees = Math.abs(degrees);

  // Ottieni i gradi, minuti e secondi
  const intDegrees = Math.floor(absDegrees);
  const minutes = (absDegrees - intDegrees) * 60;
  const intMinutes = Math.floor(minutes);
  const seconds = (minutes - intMinutes) * 60;

  // Formatta i minuti e i secondi come numeri interi
  const formattedMinutes = intMinutes.toString().padStart(2, "0");
  const formattedSeconds = seconds.toFixed(2).toString().padStart(2, "0");

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

// appena tolto
// export function calculateCoordinates(r, v, orbitalParams) {
//   const { i, Ω, ω } = orbitalParams;

//   // Calculate position in orbital plane
//   const xOrb = r * Math.cos(ω + v);
//   const yOrb = r * Math.sin(ω + v);

//   // Convert to 3D coordinates
//   const x = xOrb * (Math.cos(Ω) - Math.sin(Ω) * Math.cos(i));
//   const y = xOrb * (Math.sin(Ω) + Math.cos(Ω) * Math.cos(i));
//   const z = yOrb * Math.sin(i);

//   return { x, y, z };
// }

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

export const calcCoordsHCOrbital = (v: number, r: number) => {

  console.log('internal orb utilizza', r, v)
  const xOrb = r * Math.cos(v);
  const yOrb = r * Math.sin(v);

  return { xOrb, yOrb };
};

// APPENA TOLTO
// export const orbitalCoordsWithTrueAnomaly = (v, r, orbitalParams) => {
//   // const xOrb = r * Math.cos(v);
//   // const yOrb = r * Math.sin(v);
//   const { e, ω, a, Ω, i } = orbitalParams;

//   const xOrb = r * Math.cos(ω + v);
//   const yOrb = r * Math.sin(ω + v);

//   return { xOrb, yOrb };
// };

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
  let α = Math.atan2(y_e * Math.cos(epsilon) - z_e * Math.sin(epsilon), x_e);

  // Calcolare la declinazione (DEC) in radianti
  let δ = Math.atan2(
    z_e * Math.cos(epsilon) + y_e * Math.sin(epsilon),
    Math.sqrt(
      x_e * x_e + (y_e * Math.cos(epsilon) - z_e * Math.sin(epsilon)) ** 2
    )
  );

  if (α < 0) {
    α += 2 * Math.PI;
  }

  // Convertire RA e DEC da radianti a gradi se necessario
  let α_degrees = convertiRAinOrari(α);
  let δ_degrees = convertiDECinGradi(δ);

  return { α, δ, α_degrees, δ_degrees };
};

export function convertCoordsHCOrbitalToHCEcliptic(xOrb, yOrb, orbitalParams) {
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

// appena tolta
// export const convertCoordsOrbitalToEclipticFINALE = (
//   xOrb,
//   yOrb,
//   orbitalParams
// ) => {
//   const { ω, Ω, i } = orbitalParams;

//   const cos_w = Math.cos(ω);
//   const sin_w = Math.sin(ω);
//   const cos_i = Math.cos(i);
//   const sin_i = Math.sin(i);
//   const cos_N = Math.cos(Ω);
//   const sin_N = Math.sin(Ω);

//   const xEcl =
//     (cos_N * cos_w - sin_N * sin_w * cos_i) * xOrb -
//     (cos_N * sin_w + sin_N * cos_w * cos_i) * yOrb;
//   const yEcl =
//     (sin_N * cos_w + cos_N * sin_w * cos_i) * xOrb -
//     (sin_N * sin_w - cos_N * cos_w * cos_i) * yOrb;
//   const zEcl = sin_w * sin_i * xOrb + cos_w * sin_i * yOrb;

//   return { xEcl, yEcl, zEcl };
// };

export const calcCoordsEclipticFromAnomaly = (r, v, orbitalParams) => {
  const { xOrb, yOrb } = calcCoordsHCOrbital(r, v);

  console.log('ORB FROM INTERAL', xOrb, yOrb)



  const { xEcl, yEcl, zEcl } = convertCoordsHCOrbitalToHCEcliptic(
    xOrb,
    yOrb,
    orbitalParams
  );

  return {xEcl, yEcl, zEcl}
};
