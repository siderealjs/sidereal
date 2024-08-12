import { Angle } from "@models/position/Angle";
import { EquatorialCoords, SphericalEquatorialCoords } from "@types";
import { calcGST, calcGSTEasy, calcLST, calculateHA, calGDC, calGST, daysSinceEpoch } from "src/utils/dates";

export const calcRiseAndSetTime = (RA: Angle, DEC: Angle, date: Date) => {


// Funzione per calcolare il Tempo Siderale di Greenwich (GST)
function calculateGST(jd) {
  const jdReference = 2451545.0;
  let gst = 280.46061837 + 360.98564736629 * (jd - jdReference);
  gst = gst % 360;
  if (gst < 0) {
      gst += 360;
  }
  return gst;
}

// Funzione per calcolare l'Ora Siderale Locale (LST)
function calculateLST(gst, longitudeDegrees) {
  // Converti la longitudine in ore
  const longitudeHours = longitudeDegrees / 15;
  
  // Calcola LST in ore
  let lst = gst / 15 + longitudeHours;
  
  // Normalizza LST per l'intervallo [0, 24) ore
  lst = lst % 24;
  
  if (lst < 0) {
      lst += 24;
  }
  
  return lst;
}

// Funzione per calcolare l'Angolo Orario (HA) e l'orario di Alba/Tramonto
function calculateHourOfEvent(lst, altitudeDegrees, dec, latitudeDegrees) {

  // Converti latitudine e altezza da gradi a radianti
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
  const haRadians = Math.acos(cosHA);

  // Converti HA da radianti a ore
  const haHours = haRadians * (24 / (2 * Math.PI));

  // Calcola l'orario di alba/tramonto
  let localHour = lst + haHours;

  // Normalizza l'orario
  localHour = localHour % 24;
  if (localHour < 0) {
      localHour += 24;
  }

  return localHour;
}

// Funzione per convertire l'orario in formato 24 ore
function convertTo24HourFormat(hours) {
  hours = hours % 24;
  if (hours < 0) {
      hours += 24;
  }
  return hours;
}

// Funzione per convertire l'orario in formato 12 ore
function convertTo12HourFormat(hours) {
  const hours12 = hours % 12;
  const ampm = hours >= 12 ? 'PM' : 'AM';
  return hours12 === 0 ? `12 ${ampm}` : `${hours12} ${ampm}`;
}

// Esempio di utilizzo
const jd = 2460533; // Giorno Giuliano
const gst = calculateGST(jd);
console.log('gst', gst);
const longitudeDegrees = -0.1278; // Longitudine di Londra in gradi
const lstHours = calculateLST(gst, longitudeDegrees);

const ra = 12; // Ascensione Retta di Venere in ore
const dec = 0.18055842867132538; // DEC di Venere in radianti
const latitudeDegrees = 51.509865; // Latitudine di Londra in gradi
const altitudeDegrees = -0.833; // Altitudine desiderata in gradi per alba/tramonto

// Calcola l'orario di alba/tramonto
const localHour24 = calculateHourOfEvent(ra, lstHours, altitudeDegrees, dec, latitudeDegrees);
console.log("Orario di alba/tramonto in formato 24 ore:", convertTo24HourFormat(localHour24));

const localHour12 = convertTo12HourFormat(localHour24);
console.log("Orario di alba/tramonto in formato 12 ore:", localHour12);



}