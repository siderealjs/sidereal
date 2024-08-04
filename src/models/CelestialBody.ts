import {
  calcolaRADEC,
  convertCoordsEclipticToEquatorial,
  convertCoordsHCOrbitalToHCEcliptic,
} from "./../astronomy/coords";
import { OrbitalParams } from "./../types/OrbitalParams.type";
import orbitalParams from "../data/planets.json";
import { calcCoordsHCOrbitalAtDate } from "../astronomy/orbit";

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
    const earthParams = orbitalParams["earth"];

    const earthHCOrbital = calcCoordsHCOrbitalAtDate(date, earthParams);

    const bodyHCOrbital = calcCoordsHCOrbitalAtDate(date, this.orbitalParams);

    const earthHCEcliptic = convertCoordsHCOrbitalToHCEcliptic(
      earthHCOrbital,
      earthParams
    );

    const bodyHCEcliptic = convertCoordsHCOrbitalToHCEcliptic(
      bodyHCOrbital,
      this.orbitalParams
    );

    const xGCEclPlanet = bodyHCEcliptic.x - earthHCEcliptic.x;
    const yGCEclPlanet = bodyHCEcliptic.y - earthHCEcliptic.y;
    const zGCEclPlanet = bodyHCEcliptic.z - earthHCEcliptic.z;

    const bodyCGEclCoords = {
      x: xGCEclPlanet,
      y: yGCEclPlanet,
      z: zGCEclPlanet,
    };

    const equatorialCoords = convertCoordsEclipticToEquatorial(bodyCGEclCoords);

    // console.log("EQUATORIALI", xEq, yEq, zEq);
    const d = calcolaRADEC(equatorialCoords);

    console.log("dd", d);
  }
}
