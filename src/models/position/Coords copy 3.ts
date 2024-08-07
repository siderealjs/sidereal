import {
  Cartesian2DCoords,
  Cartesian3DCoords,
  EclipticCoords,
  EquatorialCoords,
  OrbitalCoords as OrbitalCoordsType,
  PolarCoords,
} from "../../types/Coords.type";

export class Coords<
  T extends EclipticCoords | EquatorialCoords | OrbitalCoordsType
> {
  protected spherical: T["spherical"] | null = null;
  protected cartesian: Cartesian3DCoords | null = null;

  private child: Cazzo<T> | OrbitalCoords;

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

  public getAll<
    M extends OrbitalCoordsType | EclipticCoords | EquatorialCoords
  >(): M {
    return this.child.getAll<M>() as M;
  }
}

class Cazzo<
  L extends EclipticCoords | EquatorialCoords | OrbitalCoordsType
> extends Coords<L> {
  public getAll<
    M extends OrbitalCoordsType | EclipticCoords | EquatorialCoords
  >() {
    if (!this.isDefined()) throw new Error("Missing coords");

    // @ts-ignore
    return {
      spherical: this.spherical,
      cartesian: this.cartesian as Cartesian3DCoords,
    } as M;
  }
}

export class OrbitalCoords extends Coords<any> {
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

  public getAll<
    M extends OrbitalCoordsType | EclipticCoords | EquatorialCoords
  >() {
    if (!this.isDefined()) throw new Error("Missing coords");

    // @ts-ignore
    return {
      polar: this.polar as PolarCoords,
      cartesian: this.cartesian as Cartesian2DCoords,
    } as M;
  }
}
