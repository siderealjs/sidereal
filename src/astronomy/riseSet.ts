import { Angle } from "@models/position/Angle";
import { EquatorialCoords, SphericalEquatorialCoords } from "@types";
import {
  calcGSTg,
  calcLST,
  calculateHA,
  calGST999,
  daysSinceEpoch,
} from "src/utils/dates";

export const calcRiseAndSetTime = (DEC: Angle, RA: Angle, date: Date) => {
  //const JD = daysSinceEpoch(date) + 2451544.5;
  // gst in gradi
  // const GSTX = calcGSTEasy(JD);
  //const GST = calculateGMST(2024, 8, 11, 0, 0, 0) * 360 / 24
  //console.log('GST IN GRADI', GST, GSTX);
  // const longitude_Degrees_london = -0.1278;
  // const LST = calcLST(GST, longitude_Degrees_london)

  const longitudine_radians = 0 // (-0.1276 * 2 * Math.PI) / 360;

  const HA_hours = calculateHourOfEvent(-0.833, DEC.radians(), 51.0);

  console.log('HA event', HA_hours);
  const HA_radians = HA_hours * 2 * Math.PI / 24;
  // H=LST−RA => lst = H + RA
  const LST_radians = HA_radians + RA.radians();
  console.log('LST evento:', LST_radians, '=', HA_radians, '+', RA.radians())
  console.log('in h', LST_radians * 12 / Math.PI)

  const GST_radians = LST_radians - longitudine_radians;

  console.log('GST evento')
  const GST0_hours = calculateGST0(date);

  // const GGG = calculateGMSTPSEUDOCODE(2024, 3, 11, 0 , 0, 0)
  // const GGG3 = calcGSTg(2460533.5)
  // const GGG4 = calGST999(2460533.5)

  console.log('GST', GST_radians)
  //console.log('GST0', GST0_hours, GGG, GGG3, GGG4)

  




    console.log(
      "H vero",
      GST_radians * 24 / (2 * Math.PI),
      new Angle(GST_radians).HMS()
    );
};

function calculateHourOfEvent(altitudeDegrees, dec, latitudeDegrees) {
  // Converti latitudine e altezza da gradi a radianti
  const latitudeRadians = latitudeDegrees * (Math.PI / 180);
  const altitudeRadians = altitudeDegrees * (Math.PI / 180);

  // Calcola il valore di cos(HA) usando la formula
  const sinAltitude = 0 // Math.sin(altitudeRadians);
  const sinDec = Math.sin(dec);
  const cosDec = Math.cos(dec);
  const sinLat = Math.sin(latitudeRadians);
  const cosLat = Math.cos(latitudeRadians);

  const cosHA = (sinAltitude - sinDec * sinLat) / (cosDec * cosLat);

  // Assicurati che il valore di cosHA sia compreso tra -1 e 1
  if (cosHA < -1 || cosHA > 1) {
    throw new Error("Il corpo celeste non raggiunge questa altitudine.");
  }

  // Calcola HA in radianti
  const haRadians = Math.acos(cosHA);

  // Converti HA da radianti a ore
  const haHours = haRadians * (24 / (2 * Math.PI));

  return haHours;
}

function julian(year, month, day) {
  const A = Math.floor((14 - month) / 12);
  const Y = year + 4800 - A;
  const M = month + 12 * A - 3;
  return (
    day +
    Math.floor((153 * M + 2) / 5) +
    365 * Y +
    Math.floor(Y / 4) -
    Math.floor(Y / 100) +
    Math.floor(Y / 400) -
    32045
  );
}

// Function to calculate GMST
function calculateGMSTPSEUDOCODE(year, month, day, hour, minute, second) {
  // Calculate Julian Dates
  const zdjd = julian(year, month, day);
  const ydjd = julian(year, 1, 1);

  // Convert time to decimal hours
  const time = hour + minute / 60 + second / 3600;

  // Calculate t and r values
  const t = zdjd / 36525;
  const r = 6.6460656 + 5.1262e-2 * t + 2.581e-5 * t * t;
  const r1 = 2400 * ((year - 1900) / 100);
  const b = 24 - r - r1;
  const t0 = 0.0657098 * (zdjd - ydjd) - b;

  // Calculate GMST
  const gmst = (1.002737908 * time + t0) % 24;

  // Handle negative values for GMST
  return gmst < 0 ? gmst + 24 : gmst;
}



function calculateGST0(date) {
 
 // Calcola il Giorno Giuliano (JD)
  //let JD = Math.floor(365.25 * (Y + 4716)) + Math.floor(30.6001 * (M + 1)) + D + 1720994.5;
  let JD = 2460533.5 // Math.floor(365.25 * (Y + 4716)) + Math.floor(30.6001 * (M + 1)) + D + 1720994.5;

  // Calcola il Giorno Giuliano Modificato (MJD)
  let MJD = JD - 2400000.5;

  // Calcola GST0
  let GST0 = 6.697374558 + 0.06570982441908 * (MJD - 51544.5);

  // GST0​=6.697374558+0.06570982441908×(MJD−51544.5)+1.00273790935×UT

  // Normalizza il risultato per essere tra 0 e 24 ore
  GST0 = GST0 % 24;
  if (GST0 < 0) GST0 += 24;

  return GST0; // Il risultato è in ore
}