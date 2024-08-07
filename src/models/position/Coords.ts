import {
  Cartesian3DCoords,
  EclipticCoords,
  EquatorialCoords,
} from "../../types/Coords.type";

export class Coords<T extends EclipticCoords | EquatorialCoords> {
  private spherical: T["spherical"] | null = null;
  private cartesian: Cartesian3DCoords | null = null;

  constructor() {}

  public setSpherical(spherical: T["spherical"]): void {
    this.spherical = spherical;
  }
  public getSpherical(): T["spherical"] {
    if (!this.spherical) throw new Error("No spherical coord");

    return this.spherical;
  }

  public setCartesian(cartesian: Cartesian3DCoords): void {
    this.cartesian = cartesian;
  }

  public isDefined(): boolean {
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
