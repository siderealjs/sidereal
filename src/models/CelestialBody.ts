import {
  calcCoordsHCOrbitalAtDate,
  calcolaRADEC,
  convertCoordsEclipticToEquatorial,
  convertCoordsHCOrbitalToHCEcliptic,
} from "./../astronomy/coords";
import { OrbitalParams } from "./../types/OrbitalParams.type";
import orbitalParams from "../data/planets.json";
import { CelestialBodyName } from "../types/ObjectName.type";
import {
  calculateAlphaWikipedia,
  calculateQ,
  calculateQemp,
} from "../astronomy/magnitude";

export default class CelestialBody {
  private orbitalParams: OrbitalParams;

  constructor(name: CelestialBodyName) {
    if (!orbitalParams[name]) {
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

    const d = calcolaRADEC(equatorialCoords);
    console.log("dd", d);

    return d;
  }

  public getMagnitude(date: Date) {
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

    const dx = earthHCEcliptic.x - bodyHCEcliptic.x;
    const dy = earthHCEcliptic.y - bodyHCEcliptic.y;
    const dz = earthHCEcliptic.z - bodyHCEcliptic.z;

    // Calcola la distanza usando la formula euclidea
    const distanza = Math.sqrt(dx * dx + dy * dy + dz * dz);

    console.log("disanza oggetto-terra", distanza);
    console.log("distanza oggetto-sole", bodyHCOrbital.r);

    const phaseAngle = calculateAlphaWikipedia(
      distanza,
      bodyHCOrbital.r,
      earthHCOrbital.r
    );
    console.log("phase angle", phaseAngle);

    const mm =
      this.orbitalParams.H +
      5 * Math.log10(distanza * bodyHCOrbital.r) -
      2.5 * Math.log10(calculateQ(phaseAngle.degrees));

    const mm2 =
      this.orbitalParams.Hemp +
      5 * Math.log10(distanza * bodyHCOrbital.r) +
      calculateQemp('mars', phaseAngle.degrees);

    console.log("m apparent", mm);
    console.log("m apparent empt", mm2);
  }
}
