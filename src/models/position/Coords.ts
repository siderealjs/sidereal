import {
  Cartesian3DCoords,
  EclipticCoords,
  EquatorialCoords,
} from "../../types/Coords.type";

export class Coords<T extends EclipticCoords | EquatorialCoords> {
  public spherical: T["spherical"] | null = null;
  public cartesian: Cartesian3DCoords | null = null;

  constructor() {}

  public setSpherical(spherical: T["spherical"]): void {
    this.spherical = spherical;
  }

  public setCartesian(cartesian: Cartesian3DCoords): void {
    this.cartesian = cartesian;
  }

  public isDefined(): boolean {
    // let angle = null;

    // if (this.spherical && "RA" in this.spherical) {
    //   angle = this.spherical.RA;
    // } else if (this.spherical && "lat" in this.spherical) {
    //   angle = this.spherical.lat;
    // }
    // const isSphericalDefined = angle !== null;

    const isCartesianDefined = this.cartesian !== null;
    const isSphericalDefined = this.spherical !== null;

    return isCartesianDefined && isSphericalDefined;
  }

  public getAll() {
    if (!this.isDefined()) throw new Error("Missing coords");

    return {
      spherical: this.spherical as T["spherical"],
      cartesian: this.cartesian as T["cartesian"],
    };
  }
}
