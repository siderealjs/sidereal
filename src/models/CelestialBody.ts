import {
  calcCoordsRelativeOrbital,
  calcolaRADEC,
  calculateRelativeOrbital,
} from "./../astronomy/coords";
import { OrbitalParams } from "./../types/OrbitalParams.type";
import orbitalParams from "../data/planets.json";
import {
  convertCoordsEclipticToEquatorial,
  convertCoordsOrbitalToEcliptic,
  convertCoordsRelativeOrbitalToHeliocentricOrbital,
  convertHeliocentricToCelestial,
} from "../astronomy/coords";
import {
  calcRelativeOrbitalCoordsAtDate,
  calculateRAandDEC,
} from "../astronomy/orbit";

const allbodies = { mars: { size: 3 }, earth: { size: 2 } };

export default class CelestialBody {
  private orbitalParams: OrbitalParams;

  constructor(name: string) {
    if (!allbodies[name]) {
      throw new Error(`non ce un oggetto chiamato ${name}`);
    }

    this.orbitalParams = orbitalParams[name];
  }

  public getEphemerisAtDate(date: Date) {
    const { E, e, r } = calcRelativeOrbitalCoordsAtDate(
      date,
      this.orbitalParams
    );

    const { xRel, yRel } = calcCoordsRelativeOrbital(E, e, r);
    const { xOrb, yOrb, zOrb } =
      convertCoordsRelativeOrbitalToHeliocentricOrbital(
        xRel,
        yRel,
        this.orbitalParams
      );

    const {xEq, yEq, zEq} = convertCoordsEclipticToEquatorial(xOrb, yOrb, zOrb);

    const cazzo = calcolaRADEC(xEq, yEq, zEq);

    console.log(cazzo);


    // const polo = calculateRAandDEC(r,v, this.orbitalParams)
    // const { xOrb, yOrb, zOrb } =
    //   convertCoordsRelativeOrbitalToHeliocentricOrbital(
    //     xRel,
    //     yRel,
    //     v,
    //     this.orbitalParams
    //   );

    //   console.log('POLO', polo);

    // const jjj = convertHeliocentricToCelestial(xOrb, yOrb, zOrb);

    // console.log(jjj);

    // console.log("orb", xOrb, yOrb);

    // const { xEcl, yEcl, zEcl } = convertCoordsOrbitalToEcliptic(
    //   xOrb,
    //   yOrb,
    //   this.orbitalParams
    // );

    // console.log("ecl, ", xEcl, yEcl, zEcl);

    // const { xEq, yEq, zEq } = convertCoordsEclipticToEquatorial(
    //   xEcl,
    //   yEcl,
    //   zEcl
    // );

    // console.log('eq', xEq, yEq, zEq)

    // const raRad = Math.atan2(yEq, xEq);
    // const decRad = Math.asin(
    //   zEq / Math.sqrt(xEq * xEq + yEq * yEq + zEq * zEq)
    // );

    // return {
    //   rad: {
    //     ra: raRad,
    //     dec: decRad,
    //   },
    //   deg: {
    //     ra: (raRad * 180) / Math.PI / 15,
    //     dec: (decRad * 180) / Math.PI,
    //   },
    // };
  }
}
