import { Angle } from "@models/position/Angle";
import { EquatorialCoords, SphericalEquatorialCoords } from "@types";
import { calcGST, calGDC, calGST, daysSinceEpoch } from "src/utils/dates";

export const calcRiseAndSetTime = (DEC: Angle, date: Date) => {

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
  const JD = daysSinceEpoch(date) + 2451544.5;
  console.log('CURRENT JD?', JD);
  const GST = calcGST(JD) 
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
