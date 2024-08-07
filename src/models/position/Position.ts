import {
  cartesianEclipticToCartesianEquatorial,
  cartesianEclipticToSphericalEcliptic,
  cartesianEquatorialToCartesianEcliptic,
  cartesianEquatorialToSphericalEquatorial,
  sphericalEclipticToCartesianEcliptic,
  sphericalEquatorialToCartesianEquatorial,
} from "../../astronomy/coords";
import {
  Cartesian3DCoords,
  EclipticCoords,
  EquatorialCoords,
  SphericalEquatorialCoords,
  SphericalEclipticCoords,
} from "../../types/Coords.type";
import { Coords } from "./Coords";

export class Position {
  private eclipticCoords: Coords = new Coords();

  private equatorialCoords: Coords = new Coords();

  private orbitalCoords: Coords = new Coords("orbital");

  setEclipticCoords(coords: SphericalEclipticCoords | Cartesian3DCoords) {
    let sphericalEclipticCoords;
    let cartesianEclipticCoords;

    if (this.isCoordsSpherical(coords)) {
      console.log("proseguio di qua");
      sphericalEclipticCoords = coords;
      cartesianEclipticCoords = sphericalEclipticToCartesianEcliptic(coords);
    } else {
      cartesianEclipticCoords = coords;
      sphericalEclipticCoords = cartesianEclipticToSphericalEcliptic(coords);
    }

    this.eclipticCoords.setSpherical(sphericalEclipticCoords);
    this.eclipticCoords.setCartesian(cartesianEclipticCoords);

    return this;
  }

  setEquatorialCoords(coords: SphericalEquatorialCoords | Cartesian3DCoords) {
    let sphericalEquatorialCoords;
    let cartesianEquatorialCoords;

    if (this.isCoordsSpherical(coords)) {
      sphericalEquatorialCoords = coords;
      cartesianEquatorialCoords =
        sphericalEquatorialToCartesianEquatorial(coords);
    } else {
      cartesianEquatorialCoords = coords;
      sphericalEquatorialCoords =
        cartesianEquatorialToSphericalEquatorial(coords);
    }

    this.equatorialCoords.setSpherical(sphericalEquatorialCoords);
    this.equatorialCoords.setCartesian(cartesianEquatorialCoords);

    return this;
  }

  public getEquatorialCoords(): EquatorialCoords {
    if (
      !this.equatorialCoords.isDefined() &&
      !this.eclipticCoords.isDefined()
    ) {
      throw new Error("no coords");
    }

    if (!this.equatorialCoords.isDefined() && this.eclipticCoords.isDefined()) {
      const cartesianEquatorial = cartesianEclipticToCartesianEquatorial(
        this.eclipticCoords.getAll().cartesian as Cartesian3DCoords
      );

      this.setEquatorialCoords(cartesianEquatorial);
    }

    return this.equatorialCoords.getAll();
  }

  public getEclipticCoords(): EclipticCoords {
    if (
      !this.equatorialCoords.isDefined() &&
      !this.eclipticCoords.isDefined()
    ) {
      throw new Error("no coords");
    }

    if (!this.eclipticCoords.isDefined() && this.equatorialCoords.isDefined()) {
      const cartesianEcliptic = cartesianEquatorialToCartesianEcliptic(
        this.equatorialCoords.getAll<EquatorialCoords>().cartesian
      );

      this.setEclipticCoords(cartesianEcliptic);
    }

    return this.eclipticCoords.getAll();
  }

  private isCoordsSpherical = (
    coords:
      | Cartesian3DCoords
      | SphericalEclipticCoords
      | SphericalEquatorialCoords
  ) => "lat" in coords || "RA" in coords;
}
