import { CelestialBody } from "./CelestialBody";
import { Position } from "./position/Position";
import { Sun } from "./Sun";

export class Earth extends CelestialBody {
  constructor() {
    super("earth");
  }

  public getPositionAtDate(date: Date) {
    const sun = new Sun();
    const sunPosition = sun.getPositionAtDate(date);

    const {
      x: xSun,
      y: ySun,
      z: zSun,
    } = sunPosition.getEclipticCoords().cartesian;

    const earthPosition = new Position().setEclipticCoords({
      x: -1 * xSun,
      y: -1 * ySun,
      z: -1 * zSun,
    });

    return earthPosition;
  }
}
