import { convertSphericalEclipticToCartesianEcliptic } from "../../astronomy/coords";
import {
  CartesianCoordinates3D,
  SphericalEcliptic,
  SphericalEquatorial,
} from "../../types/Coords.type";
import { Coords } from "./Coords";

export class Position {
  private eclipticCoords: Coords<SphericalEcliptic> =
    new Coords<SphericalEcliptic>();

  private equatorialCoords: Coords<SphericalEquatorial> =
    new Coords<SphericalEquatorial>();

  private polarCoordinates: Coords<any> = new Coords<any>();

  setEclipticCoords(coords: SphericalEcliptic | CartesianCoordinates3D): void {
    let sphericalEclipticCoords;
    let cartesianEclipticCoords;

    if ("lat" in coords) {
      sphericalEclipticCoords = coords;
      cartesianEclipticCoords =
        convertSphericalEclipticToCartesianEcliptic(coords);
    } else {
      cartesianEclipticCoords = coords;
      sphericalEclipticCoords =
        convertCartesianEclipticToSphericalEcliptic(coords);
    }

    this.eclipticCoords.setSpherical(sphericalEclipticCoords);
    this.eclipticCoords.setCartesian(cartesianEclipticCoords);
  }

  setEquatorialCoords(
    coords: SphericalEquatorial | CartesianCoordinates3D
  ): void {
    let sphericalEquatorialCoords;
    let cartesianEquatorialCoords;

    if ("RA" in coords) {
      sphericalEquatorialCoords = coords;
      cartesianEquatorialCoords =
        convertSphericaEquatorialToCartesianEquatorial(coords);
    } else {
      cartesianEquatorialCoords = coords;
      sphericalEquatorialCoords =
        convertCartesianEquatorialToSphericalEquatorial(coords);
    }

    this.equatorialCoords.setSpherical(sphericalEquatorialCoords);
    this.equatorialCoords.setCartesian(cartesianEquatorialCoords);
  }

  public getEquatorialCoords(): {
    cartesian: CartesianCoordinates3D;
    spherical: SphericalEquatorial;
  } {
    if (
      !this.equatorialCoords.isDefined() &&
      !this.eclipticCoords.isDefined()
    ) {
      throw new Error("no coords");
    }

    if (this.equatorialCoords.isDefined()) {
      return this.equatorialCoords.getAll();
    } else if (this.eclipticCoords.isDefined()) {
      // calculate equatorial from eclittic => return equatorial
    }
  }
}
