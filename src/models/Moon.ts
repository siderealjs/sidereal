import { CelestialBody } from "./CelestialBody";
import {
  calcolaRADEC,
  convertCoordsEclipticToEquatorial,
  convertSphericalEclipticToCartesianEcliptic,
} from "../astronomy/coords";
import { calcMoonSphericalEclipticalCoordsAtDate } from "../astronomy/moon/moonCoords";

export class Moon extends CelestialBody {
  constructor() {
    super("moon");
  }

  public getEphemerisAtDate(date: Date) {
    const moonSphericalEcl = calcMoonSphericalEclipticalCoordsAtDate(date);

    console.log('actual', moonSphericalEcl)
    const moonCartesianEcl =
      convertSphericalEclipticToCartesianEcliptic(moonSphericalEcl);

    const moonEquatorial = convertCoordsEclipticToEquatorial(moonCartesianEcl);

    const radec = calcolaRADEC(moonEquatorial);

    console.log(radec);

    return radec;
  }
}
