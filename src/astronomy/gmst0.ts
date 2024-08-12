import { Angle } from "@models/position/Angle";
import { calcMeanAnomalyAtDate } from "./anomaly";
import orbitalParams from "../data/planets.json";
import { AstroDate } from "@models/AstroDate";

export const getGMST0AtDate = (date: AstroDate) => {
  const MSun = calcMeanAnomalyAtDate(
    orbitalParams["sun"].M0,
    orbitalParams["sun"].n,
    date
  );
  const meanLongitudeSun_radians = MSun + orbitalParams["sun"].ω;
  return new Angle(meanLongitudeSun_radians + Math.PI);
};
