import { Cartesian3DCoords } from "./Coords.type";

export type Ephemeris = {
  getPositionAtDate: (date: Date) => Cartesian3DCoords;
};
