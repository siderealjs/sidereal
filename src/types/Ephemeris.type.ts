import { Cartesian3DCoords } from "./Coords.type";

export type Ephemeris = {
  name: string,
  getPositionAtDate: (date: Date) => Cartesian3DCoords;
};
