import { calcCoordsEclipticFromAnomaly, calcolaRADEC, convertCoordsEclipticToEquatorial } from "./../astronomy/coords";
import { OrbitalParams } from "./../types/OrbitalParams.type";
import orbitalParams from "../data/planets.json";
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
    const earthParams = orbitalParams["earth"];

    const { v: vEarth, r: rEarth } = calcAnomalyAndRadiusAtDate(
      date,
      earthParams
    );

    const { v: vPlanet, r: rPlanet } = calcAnomalyAndRadiusAtDate(
      date,
      this.orbitalParams
    );

    const earthHCEcliptic = calcCoordsEclipticFromAnomaly(
      rEarth,
      vEarth,
      earthParams
    );
    const planetHCEcliptic = calcCoordsEclipticFromAnomaly(
      rPlanet,
      vPlanet,
      this.orbitalParams
    );

    // console.warn("mars ecl", planetHCEcliptic);
    // console.warn("earth ecl", earthHCEcliptic);

    const xGeoEclPlanet = planetHCEcliptic.xEcl - earthHCEcliptic.xEcl;
    const yGeoEclPlanet = planetHCEcliptic.yEcl - earthHCEcliptic.yEcl;
    const zGeoEclPlanet = planetHCEcliptic.zEcl - earthHCEcliptic.zEcl;

    // console.log(
    //   "mars geocentric,",
    //   xGeoEclPlanet,
    //   yGeoEclPlanet,
    //   zGeoEclPlanet
    // );

    const { xEq, yEq, zEq } = convertCoordsEclipticToEquatorial(
      xGeoEclPlanet,
      yGeoEclPlanet,
      zGeoEclPlanet
    );

    // console.log("EQUATORIALI", xEq, yEq, zEq);
    const d = calcolaRADEC(xEq, yEq, zEq);

    console.log("dd", d);
  }
}
