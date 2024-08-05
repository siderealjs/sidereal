import {
  calcCoordsPolarAtDate,
  calcolaRADEC,
  convertCoordsEclipticToEquatorial,
  convertCoordsHCOrbitalToHCEcliptic,
  convertCoordsPolarToOrbital,
} from "./../astronomy/coords";
import { OrbitalParams } from "./../types/OrbitalParams.type";
import orbitalParams from "../data/planets.json";
import { CelestialBodyName } from "../types/ObjectName.type";
import {
  calculateAlphaWikipedia,
  calculateQ,
  calculateQemp,
} from "../astronomy/magnitude";

export class CelestialBody {
  protected orbitalParams: OrbitalParams;

  constructor(name: CelestialBodyName) {
    if (!orbitalParams[name]) {
      throw new Error(`non ce un oggetto chiamato ${name}`);
    }

    this.orbitalParams = orbitalParams[name];
  }

  public getEphemerisAtDate(date: Date) {
    const earthParams = orbitalParams["earth"];

    const earthPolar = calcCoordsPolarAtDate(date, earthParams);
    const bodyPolar = calcCoordsPolarAtDate(date, this.orbitalParams);

    const earthHCOrbital = convertCoordsPolarToOrbital(earthPolar);

    const bodyHCOrbital = convertCoordsPolarToOrbital(bodyPolar);

    const earthHCEcliptic = convertCoordsHCOrbitalToHCEcliptic(
      earthHCOrbital,
      earthParams
    );

    const bodyHCEcliptic = convertCoordsHCOrbitalToHCEcliptic(
      bodyHCOrbital,
      this.orbitalParams
    );

    console.log(44, bodyHCEcliptic);
    console.log(45, earthHCEcliptic);

    // convert to geocentric
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

    const earthPolar = calcCoordsPolarAtDate(date, earthParams);
    const bodyPolar = calcCoordsPolarAtDate(date, this.orbitalParams);

    const earthHCOrbital = convertCoordsPolarToOrbital(earthPolar);

    const bodyHCOrbital = convertCoordsPolarToOrbital(bodyPolar);

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
    console.log("distanza oggetto-sole", bodyPolar.r);

    const phaseAngle = calculateAlphaWikipedia(
      distanza,
      bodyPolar.r,
      earthPolar.r
    );
    console.log("phase angle", phaseAngle);

    const mm =
      this.orbitalParams.H +
      5 * Math.log10(distanza * bodyPolar.r) -
      2.5 * Math.log10(calculateQ(phaseAngle.degrees));

    // const mm2 =
    //   this.orbitalParams.Hemp +
    //   5 * Math.log10(distanza * bodyPolar.r) +
    //   calculateQemp("mars", phaseAngle.degrees);

    console.log("m apparent", mm);
    // console.log("m apparent empt", mm2);
  }
}
