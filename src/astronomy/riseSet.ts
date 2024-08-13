import { CelestialBody } from "@models/celestial-bodies/CelestialBody";
import { AstroDate } from "@models/AstroDate";
import { Angle } from "@models/position/Angle";

export function calcHourAngleAtDate(
  celestialBody: CelestialBody,
  prevDate: AstroDate,
  UTnoon: Angle,
  isRise: boolean
) {
  const bodyPositionNoon = celestialBody.getPositionAtDate(prevDate, 'earth');
  const { DEC } = bodyPositionNoon.getEquatorialCoords().spherical;

  const sinh = Math.sin((-0.833 * 2 * Math.PI) / 360);
  const sinDEC = Math.sin(DEC.radians());
  const sinLat = Math.sin((51 * 2 * Math.PI) / 360);
  const cosDEC = Math.cos(DEC.radians());
  const cosLat = Math.cos((51 * 2 * Math.PI) / 360);

  const cosLHA = (sinh - sinLat * sinDEC) / (cosLat * cosDEC);
  const LHA_radians = Math.acos(cosLHA);

  const setRiseFactor = isRise ? -1 : 1;
  const newAngleDate = new Angle(
    UTnoon.radians() + setRiseFactor * LHA_radians
  ).normalize();

  const newHoursDate = (newAngleDate.radians() * 24) / (2 * Math.PI);
  const newMinutesDate = (newHoursDate - Math.floor(newHoursDate)) * 60;
  const newSecondsDate = (newMinutesDate - Math.floor(newMinutesDate)) * 60;

  let newDate = new AstroDate(new Date(prevDate.getTime()));
  newDate.setUTCHours(newHoursDate);
  newDate.setUTCMinutes(newMinutesDate);
  newDate.setUTCSeconds(newSecondsDate);

  const deltaT = (newDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60);

  if (deltaT > 1) {
    newDate = calcHourAngleAtDate(celestialBody, newDate, UTnoon, isRise);
  }

  return newDate;
}
