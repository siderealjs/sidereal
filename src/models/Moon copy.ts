import {
  calcCoordsPolarAtDate,
  convertCoordsPolarToOrbital,
} from "./../astronomy/coords";
import {
  calcolaRADEC,
  convertCoordsEclipticToEquatorial,
  convertCoordsHCOrbitalToHCEcliptic,
} from "../astronomy/coords";
import { daysBetweenDates } from "../utils/dates";
import { CelestialBody } from "./CelestialBody";

export class Moon extends CelestialBody {
  constructor() {
    super("moon");
  }

  public getEphemerisAtDate(date: Date) {
    //const T = daysBetweenDates(new Date("2000-01-01"), date) / 36500;

    const today = getJulianDate_LUNAR(2024, 7, 5, 0, 0);
    console.log("today,", today);
    const T = (today - 2451545) / 36525;
    console.log("22, T", T);

    // this.orbitalParams.M0 =
    //   ((134.9633964 + (477198.8675055 * T +
    //     0.0087414 * Math.pow(T, 2) +
    //     Math.pow(T, 3) / 69699 -
    //     Math.pow(T, 4) / 14712000)) *
    //     (Math.PI / 180)) %
    //   (2 * Math.PI);

    // console.log("presunta mean anomlay", this.orbitalParams.M0);
    // dovrebbe fare 2.42408252593013

    const moonPolar = calcCoordsPolarAtDate(date, this.orbitalParams);

    // argument_of_latitude = v + ω

    const supposed_ω = 6.26908880500485;
    const supposed_argument_latitud = moonPolar.v + supposed_ω;
    const argumentOfLatitudeInDeg =
      93.272095 +
      483202.0175233 * T -
      0.0036539 * Math.pow(T, 2) -
      Math.pow(T, 3) / 3526000 +
      Math.pow(T, 4) / 863310000;

    const argumentOfLatitude =
      ((argumentOfLatitudeInDeg * Math.PI) / 180);

    console.log("arg lat", argumentOfLatitude, supposed_argument_latitud);
    this.orbitalParams.ω = -1 * (argumentOfLatitude - moonPolar.v);

    console.log("sedicente w", this.orbitalParams.ω);

    this.orbitalParams.Ω =
      (-1 *
        ((125.04452 -
          1934.136261 * T +
          0.0020708 * Math.pow(T, 2) +
          Math.pow(T, 3) / 450000) *
          (Math.PI / 180))) %
      (2 * Math.PI);

    console.log(
      "corretto",
      this.orbitalParams.M0,
      this.orbitalParams.Ω,
      this.orbitalParams.ω
    );
    // Calcolare il Longitude of the Ascending Node aggiornato
    //this.orbitalParams.Ω -= this.calcolaAngolo(date, 18.61);

    // Calcolare l'Argument of Perigee aggiornato
    //this.orbitalParams.ω += this.calcolaAngolo(date, 8.85);

    // const earthHCEcliptic = convertCoordsHCOrbitalToHCEcliptic(
    //   earthHCOrbital,
    //   earthParams
    // );

    const moonOrbital = convertCoordsPolarToOrbital(moonPolar);

    const bodyGCEcliptic = convertCoordsHCOrbitalToHCEcliptic(
      moonOrbital,
      this.orbitalParams
    );

    console.log(44, bodyGCEcliptic);

    // convert to geocentric
    // const xGCEclPlanet = bodyHCEcliptic.x - earthHCEcliptic.x;
    // const yGCEclPlanet = bodyHCEcliptic.y - earthHCEcliptic.y;
    // const zGCEclPlanet = bodyHCEcliptic.z - earthHCEcliptic.z;

    // const bodyCGEclCoords = {
    //   x: xGCEclPlanet,
    //   y: yGCEclPlanet,
    //   z: zGCEclPlanet,
    // };

    const equatorialCoords = convertCoordsEclipticToEquatorial(bodyGCEcliptic);

    const d = calcolaRADEC(equatorialCoords);
    console.log("dd", d);

    return d;
  }

  // Funzione comune per calcolare l'angolo corretto
  private calcolaAngolo(dataCorrenteObj: Date, periodo) {
    const d0 = new Date("2000-01-01");
    // Calcolare il numero di giorni tra le due date
    const giorniTrascorsi = daysBetweenDates(d0, dataCorrenteObj);
    console.log(67, "giorni trascorisi", giorniTrascorsi);
    const anniTrascorsi = giorniTrascorsi / 365.25;

    console.log(69, "anni trascorsi", anniTrascorsi);
    // Calcolare il numero di rivoluzioni complete
    const rivoluzioniComplete = anniTrascorsi / periodo;

    console.log("riv com", rivoluzioniComplete);
    // Calcolare l'angolo totale di regressione o progressione
    const angoloTotale = rivoluzioniComplete * 2 * Math.PI;

    console.log("ang to", angoloTotale);
    // Calcolare l'angolo corretto

    const angoloNrmalizzato =
      ((angoloTotale % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

    console.log("ang norma", angoloNrmalizzato);
    // Assicurarsi che l'angolo sia compreso tra 0° e 360°
    return angoloNrmalizzato;
  }
}

function getJulianDate_LUNAR(Year, Month, Day, Hour, Minute) {
  var inputDate = new Date(Date.UTC(Year, Month, Day, Minute));
  console.log("input date", inputDate);
  var switchDate = new Date(Date.UTC("1582", "10", "15"));

  var isGregorianDate = inputDate >= switchDate;

  //Adjust if B.C.
  if (Year < 0) {
    Year++;
  }

  //Adjust if JAN or FEB
  if (Month == 1 || Month == 2) {
    Year = Year - 1;
    Month = Month + 12;
  }

  //Calculate A & B; ONLY if date is equal or after 1582-Oct-15
  var A = Math.floor(Year / 100); //A
  var B = 2 - A + Math.floor(A / 4); //B

  //Ignore B if date is before 1582-Oct-15
  if (!isGregorianDate) {
    B = 0;
  }

  //Added Minute Accuracy
  return (
    Math.floor(365.25 * Year) +
    Math.floor(30.6001 * (Month + 1)) +
    Day +
    0.04166666666666666666666666666667 * Hour +
    0.000694444444444444 * Minute +
    1720994.5 +
    B
  );
}
