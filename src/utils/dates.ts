import { Angle } from "@models/position/Angle";

export const daysBetweenDates = (date1: Date, date2: Date): number => {
  const millisecondsPerDay = 86400000; // 24 * 60 * 60 * 1000
  const timeDifference = date2.getTime() - date1.getTime(); // differenza in millisecondi

  return timeDifference / millisecondsPerDay; // converti in giorni
};

export const daysSinceEpoch = (date: Date) => {
  // Definisci l'epoca standard (1 gennaio 2000 00:00 UTC)
  const epoch = new Date(Date.UTC(2000, 0, 1, 0, 0, 0));
  // Calcola la differenza in millisecondi tra la data fornita e l'epoca
  const differenceInMillis = date.getTime() - epoch.getTime();

  // Converti la differenza da millisecondi a giorni
  const differenceInDays = differenceInMillis / (1000 * 60 * 60 * 24);

  return differenceInDays;
};

const daysSinceJ1900 = (date: Date): number => {
  // Definire il giorno giuliano all'inizio del 1900
  const J1900 = 2415020.0;

  // Calcolare il giorno giuliano della data fornita
  const JD = date.getTime() / 86400000 + 2440587.5;

  // Restituire i giorni trascorsi dal giorno giuliano di riferimento
  return JD - J1900;
};

export const centuriesFromJ1900 = (date: Date) => {
  const days = daysSinceJ1900(date);
  const T = days / 36525.0;
  return T;
};

export const createUTCDate = (
  y: number,
  m: number,
  d: number,
  h: number = 0,
  min: number = 0
) => {
  // this already magically converts the hour in UTC
  // it subtracts 1 from hours when it's appropriate

  return new Date(y, m - 1, d, h, min, 0);
};

export const calGST999 = (julianDay: number) => {
  const T = (julianDay - 2451545.0) / 36525;

  // Calcola il GST a 0h UT (in gradi)
  let GST0 =
    100.46061837 +
    36000.770053608 * T +
    0.000387933 * T * T -
    (T * T * T) / 38710000;

  const UT = calculateUT(julianDay); // Sostituisci con l'ora UT corrente se disponibile
console.log('UT INTERNO', UT)
  // Calcola il GST completo aggiungendo la componente UT
  let GST = GST0 + 360.98564724 * (UT / 24);

  // Normalizza GST in un intervallo di 0-360 gradi
  GST = GST % 360;
  if (GST < 0) {
    GST += 360;
  }

  //const GSTAngle = new Angle().setDegrees(GST);

  //return GSTAngle

  // // Converti GST in ore
   const GST_hours = GST / 15;

   return GST_hours;
  // console.log("GST in gradi:", GST); // GST in gradi
  // console.log("GST in ore:", GST_hours); // GST in ore
};


export function calcGSTg(julianDate: number) {
  const T = (julianDate - 2451545.0) / 36525.0;

    // Calcolo dell'angolo GST in gradi
    let gstDegrees = 280.46061837 + 360.98564736629 * (julianDate - 2451545.0) +
                     T * T * (0.000387933 - T / 38710000.0);

    // Normalizzazione dell'angolo GST in gradi
    gstDegrees = gstDegrees % 360;
    if (gstDegrees < 0) gstDegrees += 360;

    // Converti in ore
    const gstHours = gstDegrees / 15.0;

    return gstHours;
}



export function calcLST(GST_degrees, longitude_Degrees) {
  // Converti la longitudine in ore
  const longitudeHours = longitude_Degrees / 15;
  const gstHours = GST_degrees / 15;
  
  // Calcola LST in ore
  let lst = gstHours + longitudeHours;
  
  // Normalizza LST per l'intervallo [0, 24) ore
  lst = lst % 24;
  
  // Assicurati che il risultato sia positivo
  if (lst < 0) {
      lst += 24;
  }
  
  return lst;
}

export function calculateHA(lstHours, raRadians) {
  // Converti LST da ore a radianti
  const lstRadians = lstHours * (2 * Math.PI / 24);
  
  // Calcola HA
  let ha = lstRadians - raRadians;
  
  // Normalizza HA per l'intervallo [-π, π)
  if (ha > Math.PI) {
      ha -= 2 * Math.PI;
  } else if (ha < -Math.PI) {
      ha += 2 * Math.PI;
  }
  
  return ha;
}

export const calculateUT = (JD: number) => {
  const JD0 = Math.floor(JD - 0.5) + 0.5; // Giorno giuliano senza frazione decimale
  const UT = (JD - JD0) * 24; // Frazione del giorno in ore
  return UT;
};


export const calcHourAngle = (GST: Angle, RA: Angle) => {

  return new Angle(GST.radians() - RA.radians());
}