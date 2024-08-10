import { Angle } from "@models/position/Angle";

export type Cartesian3DCoords = {
  x: number;
  y: number;
  z: number;
};

export type Cartesian2DCoords = {
  x: number;
  y: number;
};

export type PolarCoords = {
  v: Angle;
  r: number;
};

export type SphericalEclipticCoords = {
  lat: Angle;
  lng: Angle;
  r: number;
};

export type SphericalEquatorialCoords = {
  RA: Angle;
  DEC: Angle;
  r: number;
};

export type EclipticCoords = {
  cartesian: Cartesian3DCoords;
  spherical: SphericalEclipticCoords;
};

export type EquatorialCoords = {
  cartesian: Cartesian3DCoords;
  spherical: SphericalEquatorialCoords;
};

export type OrbitalCoords = {
  cartesian: Cartesian2DCoords;
  polar: PolarCoords;
};
