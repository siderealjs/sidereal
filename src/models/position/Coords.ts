import {
  Cartesian2DCoords,
  Cartesian3DCoords,
  EclipticCoords,
  EquatorialCoords,
  OrbitalCoords as OrbitalCoordsType,
  PolarCoords,
  SphericalEclipticCoords,
  SphericalEquatorialCoords,
} from "../../types/Coords.type";

export class Coords<
  T extends EclipticCoords | EquatorialCoords
> {
  protected spherical: T["spherical"] | null = null;
  protected cartesian: Cartesian3DCoords | null = null;

  private child: Cazzo<T["spherical"]> | OrbitalCoords;

  constructor(coordType: "orbital" | "ecliptic" | "equatorial" = "ecliptic") {
    if (coordType === "orbital") {
      this.child = new OrbitalCoords("orbital");
    }
    this.child = new Cazzo();

    return this.child;
  }

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
    return this.child.getAll();
  }
}

class Cazzo<
  K extends SphericalEclipticCoords | SphericalEquatorialCoords
> extends Coords<EclipticCoords | EquatorialCoords> {
  public getAll() {
    if (!this.isDefined()) throw new Error("Missing coords");

    return {
      spherical: this.spherical as K,
      cartesian: this.cartesian as Cartesian3DCoords,
    };
  }
}

class OrbitalCoords extends Coords<EquatorialCoords> {
  private polar: PolarCoords | null = null;

  public setPolar(polar: PolarCoords): void {
    this.polar = polar;
  }

  public getPolar(): PolarCoords {
    if (!this.polar) throw new Error("No spherical coord");

    return this.polar;
  }

  public isDefined(): boolean {
    const isCartesianDefined = this.cartesian !== null;
    const isPolarDefined = this.polar !== null;

    return isCartesianDefined && isPolarDefined;
  }

  public getAll() {
    if (!this.isDefined()) throw new Error("Missing coords");

    return {
      polar: this.polar as PolarCoords,
      cartesian: this.cartesian as Cartesian2DCoords,
    };
  }
}
