import { toRadians } from "../utils/angles";
import { daysSinceEpoch } from "../utils/dates";
import { CelestialBody } from "./CelestialBody";

export class Moon extends CelestialBody {
  constructor() {
    super("moon");
  }

  public getEphemerisAtDate(date: Date) {
    const deltaDays = daysSinceEpoch(date);

    console.log(deltaDays);

    const { lSun, mSun } = calculateMSunAndLsun();

    // L_uncor = 13.176339686 * De + ASTOrbits.getOEObjLonAtEpoch(idxMoon)
    const long_eclittica_non_corretta =
      this.calcolaLongitudineEclitticaNonCorretta(deltaDays);

    //Omega = ASTOrbits.getOEObjLonAscNode(idxMoon) - 0.0529539 * De
    const LongitudineOfAscendingNode_Non_Corretta =
      this.calcolaLongitudineOfAscendingNodeNonCorretta(deltaDays);

    // Mm = L_uncor - 0.1114041 * De - ASTOrbits.getOEObjLonAtPeri(idxMoon)
    const meanANomaly_non_corretta = this.calcolaMeanAnomalyNonCorretta(
      deltaDays,
      long_eclittica_non_corretta
    );

    //correzione dell'equazione annuale (Ae):
    const Ae = 0.1858 * Math.sin(toRadians(mSun));

    // Calculate the evection correction (Ev)
    //     Ev = 1.2739 * ASTMath.SIN_D(2 * (L_uncor - Lsun) - Mm)
    const Ev =
      1.2739 *
      Math.sin(
        toRadians(
          2 * (long_eclittica_non_corretta - lSun) - meanANomaly_non_corretta
        )
      );

    //  Calculate the mean anomaly correction.
    //     Ca = Mm + Ev - Ae - 0.37 * ASTMath.SIN_D(Msun)
    const Ca =
      meanANomaly_non_corretta + Ev - Ae - 0.37 * Math.sin(toRadians(mSun));

    // Calculate the Moon's true anomaly (Vmoon)
    //     Vmoon = 6.2886 * ASTMath.SIN_D(Ca) + 0.214 * ASTMath.SIN_D(2 * Ca)
    const Vmoon =
      6.2886 * Math.sin(toRadians(Ca)) + 0.214 * Math.sin(toRadians(2 * Ca));

    console.log("TURE ANOMALY,", Vmoon);

    //  Calculate the corrected ecliptic longitude (L_p)
    // L_p = L_uncor + Ev + Vmoon - Ae
    const L_p = long_eclittica_non_corretta + Ev + Vmoon - Ae;

    // 18. Calculate the variation correction (V)
    // V = 0.6583 * sin[2 * (L_p - Lsun)]
    const V = 0.6583 * Math.sin(toRadians(2 * (L_p - lSun)));

    // 19. Calculate the Moon's true ecliptic longitude (L_t)
    // L_t = L_p + V
    const L_t = L_p + V;

    // 20. Compute the corrected ecliptic longitude of the ascending node (Omega_p)
    // Omega_p = Omega - 0.16 * sin(Msun)
    const Omega_p =
      LongitudineOfAscendingNode_Non_Corretta -
      0.16 * Math.sin(toRadians(mSun));

    // 21. Calculate y = sin(L_t - Omega_p) * cos(inclination)
    // where inclination is needed for this calculation.
    const inclin = 5.1453964;
    const y = Math.sin(toRadians(L_t - Omega_p)) * Math.cos(toRadians(inclin));

    // 22. Calculate x = cos(L_t - Omega_p)
    const x = Math.cos(toRadians(L_t - Omega_p));

    // 23. Compute dT = inv tan(y / x)
    let dT = Math.atan2(y, x) * (180 / Math.PI); // atan2 to handle the correct quadrant

    // Print the results
    console.log(
      "23. Compute T = inv tan(y/x) = inv tan(" +
        y +
        " / " +
        x +
        ") = " +
        dT +
        " degrees"
    );

    // 24. Adjust dT based on the quadrant
    dT = adjustQuadrant(dT, x, y); // Use the adjustQuadrant function from earlier

    // 25. Calculate the Moon's ecliptic longitude
    let Lmoon = Omega_p + dT;

    // 26. Adjust Lmoon if it exceeds 360 degrees
    if (Lmoon > 360.0) {
      Lmoon -= 360.0;
    }
    console.log("26. If Lmoon > 360, then subtract 360.");
    console.log("    Lmoon = " + Lmoon + " degrees");

    // 27. Calculate the Moon's ecliptic latitude
    const Bmoon =
      Math.asin(
        Math.sin(toRadians(L_t - Omega_p)) * Math.sin(toRadians(inclin))
      ) *
      (180 / Math.PI);

    // 28. Convert the Moon's ecliptic coordinates (Bmoon, Lmoon) to equatorial coordinates
    // getepochdate = 2000 apparently

    console.log("quasi finale", toRadians(Bmoon), toRadians(Lmoon));

    // const eqCoord = eclipticToEquatorial(Bmoon, Lmoon, getEpochDate()); // Define or get this function as needed

    // // 29. Convert the Moon's equatorial coordinates to horizon coordinates
    // const observerLat = ...; // Replace with observer's latitude
    // const LST = ...; // Replace with Local Sidereal Time

    // const horizonCoord = equatorialToHorizon(
    //   eqCoord.rightAscension,
    //   eqCoord.declination,
    //   observerLat,
    //   LST
    // ); // Define or get this function as needed

    // // Return or use the calculated horizon coordinates
    // return {
    //   altitude: horizonCoord.altitude,
    //   azimuth: horizonCoord.azimuth
    // };
  }

  private calcolaLongitudineEclitticaNonCorretta(deltaDays) {
    const tassoMovimentoLuna = 13.176339686; // Tasso di movimento della Luna in gradi per giorno
    const L_0 = 218.316433; // Longitudine eclittica media della Luna all'epoca standard

    const L_uncor = L_0 + tassoMovimentoLuna * deltaDays;

    return normalizeAngle(L_uncor);
  }

  //mean longitude of the ascending node
  private calcolaLongitudineOfAscendingNodeNonCorretta(deltaDays) {
    const LonAscNode = 125.044522; // Longitudine dell'ascendente della Luna (at epoch?)

    // Passaggio 9: Calcolare la Longitudine Media dell'Ascendente della Luna (Omega)
    const Omega = LonAscNode - 0.0529539 * deltaDays;
    return normalizeAngle(Omega);
  }

  private calcolaMeanAnomalyNonCorretta(deltaDays, L_uncor) {
    const LonAtPeri = 83.353451; // Longitudine al perigeo della Luna

    const Mm = L_uncor - 0.1114041 * deltaDays - LonAtPeri;

    return normalizeAngle(Mm);
  }
}

// Funzione per normalizzare l'angolo tra 0 e 360 gradi
function normalizeAngle(angle) {
  return ((angle % 360) + 360) % 360;
}

const calculateMSunAndLsun = () => {
  return {
    mSun: 320.528,
    lSun: 134.89,
  };
};

function adjustQuadrant(dT, x, y) {
  // Use the algebraic signs of y and x to determine the quadrant adjustment
  // and apply it to dT
  let adjustment = 0;

  if (x < 0) {
    adjustment = 180;
  } else if (y < 0) {
    adjustment = 360;
  }

  // Apply the adjustment
  dT = (dT + adjustment) % 360;

  // Ensure the angle is within the range [0, 360) degrees
  if (dT < 0) {
    dT += 360;
  }

  return dT;
}
