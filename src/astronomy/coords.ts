import { OrbitalParams } from "./../types/OrbitalParams.type";

export const calcCoordsRelativeOrbital = (E, e, r) => {
  // Calcola le coordinate nel piano orbitale
  const x = r * (Math.cos(E) - e);
  const y = r * Math.sqrt(1 - e * e) * Math.sin(E);

  // Ritorna un oggetto con le coordinate x, y, e z
  return {
    xRel: x,
    yRel: y,
  };
};

export const convertCoordsRelativeOrbitalToHeliocentricOrbital = (
  xRel: number,
  yRel: number,
  orbitalParams: OrbitalParams
) => {
  const { i, ω } = orbitalParams;

  const x_ecl = xRel * Math.cos(ω) - yRel * (Math.sin(ω) * Math.cos(i));
  const y_ecl = xRel * Math.sin(ω) + yRel * (Math.cos(ω) * Math.cos(i));
  const z_ecl = yRel * Math.sin(i);

  // Ritorna un oggetto con le coordinate x, y, e z nel sistema eclittico
  return {
    xOrb: x_ecl,
    yOrb: y_ecl,
    zOrb: z_ecl,
  };

  // // Calcolo di cos(omega + v) e sin(omega + v)
  // const cosOmegaPlusV = Math.cos(omegaPlusV);
  // const sinOmegaPlusV = Math.sin(omegaPlusV);

  // // Calcolo di cos(i) e sin(i)
  // const cosI = Math.cos(i);
  // const sinI = Math.sin(i);

  // // Calcolo delle coordinate nel sistema heliocentrico
  // const xOrb =
  //   xRel * (Math.cos(Ω) * cosOmegaPlusV - Math.sin(Ω) * sinOmegaPlusV * cosI);
  // const yOrb =
  //   xRel * (Math.sin(Ω) * cosOmegaPlusV + Math.cos(Ω) * sinOmegaPlusV * cosI);
  // const zOrb = yRel * (sinOmegaPlusV * sinI);

  // return { xOrb, yOrb, zOrb };
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

export const convertCoordsEclipticToEquatorial = (
  xEcl: number,
  yEcl: number,
  zEcl: number
) => {
  // Converti in coordinate equatoriali
  const epsilonInRadians = 0.408407; // Obliquità dell'eclittica in gradi

  const x_eq =
    xEcl * Math.cos(epsilonInRadians) + yEcl * Math.sin(epsilonInRadians);
  const y_eq =
    -1 * xEcl * Math.sin(epsilonInRadians) + yEcl * Math.cos(epsilonInRadians);
  const z_eq = zEcl;

  return {
    xEq: x_eq,
    yEq: y_eq,
    zEq: z_eq,
  };

  const xEq = xEcl;
  const yEq =
    yEcl * Math.cos(epsilonInRadians) - zEcl * Math.sin(epsilonInRadians);
  const zEq =
    yEcl * Math.sin(epsilonInRadians) + zEcl * Math.cos(epsilonInRadians);

  return { xEq, yEq, zEq };
};



function convertiRAinOrari(rad) {
  // Converti RA da radianti a gradi
  const gradi = rad * 180 / Math.PI;

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

  return `${ore.toString().padStart(2, '0')}h ${minuti.toString().padStart(2, '0')}m ${secondi.toString().padStart(2, '0')}s`;
}

/**
* Converte un valore in radianti in un formato gradi, minuti e secondi.
* @param {number} rad - Valore in radianti.
* @returns {string} - Formato "+dd° mm’ ss”".
*/
function convertiDECinGradi(rad) {
  // Converti DEC da radianti a gradi
  const gradi = rad * 180 / Math.PI;
  
  // Determina il segno per il formato
  const segno = gradi >= 0 ? '+' : '-';
  const gradiAssoluti = Math.abs(gradi);
  
  // Calcola gradi, minuti e secondi
  const gradiInt = Math.floor(gradiAssoluti);
  const minuti = Math.floor((gradiAssoluti - gradiInt) * 60);
  const secondi = Math.round(((gradiAssoluti - gradiInt) * 60 - minuti) * 60);

  return `${segno}${gradiInt.toString().padStart(2, '0')}° ${minuti.toString().padStart(2, '0')}’ ${secondi.toString().padStart(2, '0')}”`;
}

/**
* Calcola la Declinazione (DEC) e l'Ascensione Retta (RA) e converte in formato leggibile.
* @param {number} x_eq - Coordinata x nel sistema equatoriale.
* @param {number} y_eq - Coordinata y nel sistema equatoriale.
* @param {number} z_eq - Coordinata z nel sistema equatoriale.
* @returns {Object} - Oggetto contenente RA e DEC nel formato leggibile.
*/
export function calcolaRADEC(x_eq, y_eq, z_eq) {
  // Calcola il raggio
  const r = Math.sqrt(x_eq * x_eq + y_eq * y_eq + z_eq * z_eq);

  // Calcola DEC
  const DEC = Math.asin(z_eq / r); // Declinazione (in radianti)

  // Calcola RA
  let RA = Math.atan2(y_eq, x_eq); // Ascensione Retta (in radianti)

  // Correggi RA se è negativo
  if (RA < 0) {
      RA += 2 * Math.PI;
  }

  console.log('prima di formattare, ', RA, DEC);
  // Converti RA e DEC in formato leggibile
  const raFormattato = convertiRAinOrari(RA);
  const decFormattato = convertiDECinGradi(DEC);

  return {
      RA: raFormattato,
      DEC: decFormattato
  };
}
