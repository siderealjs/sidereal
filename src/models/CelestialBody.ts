import {
  calcolaRADEC,
  convertCoordsOrbitalToEcliptic,
  convertCoordsOrbitalToEcliptic2,
  ecliptictToRaDec,
  orbitalCoordsWithTrueAnomaly,
  transformToEcliptic,
  transformToEcliptic4,
} from "./../astronomy/coords";
import { OrbitalParams } from "./../types/OrbitalParams.type";
import orbitalParams from "../data/planets.json";
import { convertCoordsEclipticToEquatorial } from "../astronomy/coords";
import { calcAnomalyAndRadiusAtDate } from "../astronomy/orbit";

const allbodies = {
  mars: { size: 3 },
  earth: { size: 2 },
  venus: {},
  mercury: "",
};

export default class CelestialBody {
  private orbitalParams: OrbitalParams;

  constructor(name: string) {
    if (!allbodies[name]) {
      throw new Error(`non ce un oggetto chiamato ${name}`);
    }

    this.orbitalParams = orbitalParams[name];
  }

  public getEphemerisAtDate(date: Date) {
    const { v, r } = calcAnomalyAndRadiusAtDate(date, this.orbitalParams);

    const { xOrb, yOrb } = orbitalCoordsWithTrueAnomaly(v, r);
    console.log("orb coord with true anomaly", xOrb, yOrb);

    const ec1 = convertCoordsOrbitalToEcliptic(xOrb, yOrb, this.orbitalParams);
    console.log("ECLIP, ", ec1);

    const fdd = convertCoordsOrbitalToEcliptic2(xOrb, yOrb, this.orbitalParams);
    console.log("ECLIP2, ", fdd);

    const { xEcl, yEcl, zEcl } = transformToEcliptic4(xOrb, yOrb, this.orbitalParams);
    const jj = transformToEcliptic(
      xOrb,
      yOrb,
      this.orbitalParams
    );
    console.log("ECLIP3", jj);

    console.log("ECLIP4, ", xEcl, yEcl, zEcl);

    const dirette = ecliptictToRaDec(xEcl, yEcl, zEcl);

    console.log("RADEC DIRECT", dirette);

    const {xEq, yEq, zEq} = convertCoordsEclipticToEquatorial(xEcl, yEcl, zEcl);
    const d = calcolaRADEC(xEq, yEq, zEq);

    console.log(d)

    // DEC DEVE FARE 0.3725 radians radians
    // RA DEVE FARE 1.1913 radians
  }
}
