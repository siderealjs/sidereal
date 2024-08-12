import { Angle } from "@models/position/Angle";
import { EquatorialCoords, SphericalEquatorialCoords } from "@types";
import { calcGST, calcGSTEasy, calcLST, calculateHA, calGDC, calGST, daysSinceEpoch } from "src/utils/dates";

export const calcRiseAndSetTime = (RA: Angle, DEC: Angle, date: Date) => {


  const JD = daysSinceEpoch(date) + 2451544.5;
  // gst in gradi
  const GST = calcGSTEasy(JD);
  console.log('GST IN GRADI', GST);
  const longitude_Degrees_london = -0.1278;
 // const LST = calcLST(GST, longitude_Degrees_london)
  //console.log('LST in ore ', LST);

  //const HA = calculateHA(LST, RA.radians());
  //console.log('HA in radians', HA); 


  const HA_at_rise = calculateHAForAltitude(DEC.radians(), 51.509865, -0.833)
  console.log('HA_ATRISE', HA_at_rise)



// Converti HA in ore
const haHours = convertHARadiansToHours(HA_at_rise);
console.log('hahours', haHours)
// Calcola l'orario in formato 24 ore
const localHour24 = convertTo24HourFormat(LST + haHours);
console.log("Orario in formato 24 ore:", localHour24);



  const latAngle = new Angle().setDegrees(51.509865);

  const DECValue = DEC.radians();
  const latValue = latAngle.radians();

  // Calcola il valore di cos(H)
  let cosH =
    -(Math.sin(latValue) * Math.sin(DECValue)) /
    (Math.cos(latValue) * Math.cos(DECValue));

  // Gestisci i casi in cui cos(H) è al di fuori dell'intervallo [-1, 1] a causa di errori numerici
  if (cosH < -1) cosH = -1;
  if (cosH > 1) cosH = 1;

  // Calcola H in radianti
  const H = new Angle(Math.acos(cosH));

  const Hore = H.radians() * 12 / Math.PI;

  console.log(Hore, 'questo e' )
  
  console.log('CURRENT JD?', JD);
  const GST1 = calcGST(JD) 
  const GST0 = calGST(JD) 

  console.log('GST', GST, GST0)
  const UTH = GST - Hore
  const UT = new Angle(GST - Hore)

  console.log('UTH', UTH)
  console.log("Orario di Alba (in ore UTC):", UT.HMS());
  console.log(
    "Orario di Tramonto (in ore UTC):",
    new Angle(-1 * UT.radians()).HMS()
  );
};


function calculateHAForAltitude(dec, latitudeDegrees, altitudeDegrees) {
  // Converti la latitudine e l'altitudine da gradi a radianti
  const latitudeRadians = latitudeDegrees * (Math.PI / 180);
  const altitudeRadians = altitudeDegrees * (Math.PI / 180);

  // Calcola il valore di cos(HA) usando la formula
  const sinAltitude = Math.sin(altitudeRadians);
  const sinDec = Math.sin(dec);
  const cosDec = Math.cos(dec);
  const sinLat = Math.sin(latitudeRadians);
  const cosLat = Math.cos(latitudeRadians);

  const cosHA = (sinAltitude - sinDec * sinLat) / (cosDec * cosLat);

  // Assicurati che il valore di cosHA sia compreso tra -1 e 1
  if (cosHA < -1 || cosHA > 1) {
      throw new Error('Il corpo celeste non raggiunge questa altitudine.');
  }

  // Calcola HA in radianti
  let ha = Math.acos(cosHA);

  // Considera anche il caso dell'angolo orario negativo
  if (sinAltitude < 0) {
      ha = -ha;
  }

  return ha;
}



function convertHARadiansToHours(haRadians) {
  // Converti HA da radianti a ore
  return haRadians * (24 / (2 * Math.PI));
}

function convertTo24HourFormat(hours) {
  // Normalizza l'orario per l'intervallo [0, 24) ore
  hours = hours % 24;
  if (hours < 0) {
      hours += 24;
  }
  return hours;
}

