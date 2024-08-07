import {
  convertCoordsEclipticToEquatorial,
  convertSphericalEclipticToCartesianEcliptic,
} from "../astronomy/coords";
import {
  CartesianCoordinates3D,
  SphericalEcliptic,
} from "../types/Coords.type";

export class Position {
  public cartesianEquatorial: CartesianCoordinates3D | null = null;

  private _cartesianEcliptic: CartesianCoordinates3D | null;
  private _sphericalEcliptic: SphericalEcliptic | null;

  constructor() {
    this._sphericalEcliptic = null;
    this._cartesianEcliptic = null;
  }

  get sphericalEcliptic(): SphericalEcliptic | null {
    return this._sphericalEcliptic;
  }
  set sphericalEcliptic({ lat, lng }: SphericalEcliptic) {
    this._sphericalEcliptic = { lat, lng };

    if (this.cartesianEcliptic === null) {
      this.cartesianEcliptic = convertSphericalEclipticToCartesianEcliptic({
        lat,
        lng,
      });
    }
  }
  public setSphericalEliptic({ lat, lng }: SphericalEcliptic) {
    this.sphericalEcliptic = { lat, lng };

    return this;
  }

  get cartesianEcliptic(): CartesianCoordinates3D | null {
    return this._cartesianEcliptic;
  }
  set cartesianEcliptic({ x, y, z }: CartesianCoordinates3D) {
    this._cartesianEcliptic = { x, y, z };

    if (this.cartesianEquatorial === null) {
      this.cartesianEquatorial = convertCoordsEclipticToEquatorial({ x, y, z });
    }
  }
}
