import { Angle } from "@models/position/Angle";
import { calcMeanAnomalyAtDate } from "./anomaly";
import orbitalParams from "../data/planets.json";
import { AstroDate } from "@models/AstroDate";
import { Sun } from "@models/celestial-bodies/Sun";

export const calcGMST0AtDate = (date: AstroDate) => {
  const MSun = calcMeanAnomalyAtDate(
    orbitalParams["sun"].M0,
    orbitalParams["sun"].n,
    date
  );
  const meanLongitudeSun_radians = MSun + orbitalParams["sun"].ω;
  return new Angle(meanLongitudeSun_radians + Math.PI);
};

export const getUTNoon = (date: AstroDate, long: number) => {
  const GMST0 = calcGMST0AtDate(date);
  
  const UTCnoon = new AstroDate(date).setNoon();

  const sun = new Sun();
  const sunPositionNoon = sun.getPositionAtDate(UTCnoon);
  const RANoon = sunPositionNoon.getEquatorialCoords().spherical.RA;

  return new Angle(RANoon.radians() - GMST0.radians() - long);
};
