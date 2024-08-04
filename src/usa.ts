import { Constants, CelestialBody } from "./index";

const mars = new CelestialBody("mars");
const todayx = new Date("2024-08-04");
const today = new Date("2024-08-04");

console.log(todayx, today);

const ephemerisMars = mars.getEphemerisAtDate(today);

console.log(ephemerisMars);

// Funzione per calcolare le coordinate eclittiche di Marte
function calculateEclipticCoordinates(a, e, i, Ω, ω, v) {
    // Converti i gradi in radianti
    const toRadians = degrees => degrees * (Math.PI / 180);
    
    // Parametri orbitali in radianti
    const i_rad = toRadians(i); // Inclinazione
    const Ω_rad = toRadians(Ω); // Longitudine dell'ascendente nodo
    const ω_rad = toRadians(ω); // Argomento del periastro
    const v_rad = toRadians(v); // Anomalia vera
    
    // Calcolo della distanza radiale
    const r = a * (1 - e * e) / (1 + e * Math.cos(v_rad));
    
    // Coordinate nel piano orbitale
    const x_orbit = r * (Math.cos(ω_rad + v_rad));
    const y_orbit = r * (Math.sin(ω_rad + v_rad));
    
    // Coordinate eclittiche
    const x_ecl = x_orbit * (Math.cos(Ω_rad) - Math.sin(Ω_rad) * Math.sin(i_rad)) 
                 - y_orbit * (Math.cos(Ω_rad) * Math.sin(i_rad) * Math.sin(ω_rad + v_rad) + Math.sin(Ω_rad) * Math.cos(i_rad));
    const y_ecl = x_orbit * (Math.sin(Ω_rad) * Math.cos(i_rad) + Math.cos(Ω_rad) * Math.sin(i_rad) * Math.sin(ω_rad + v_rad)) 
                 + y_orbit * (Math.sin(Ω_rad) * Math.cos(i_rad) - Math.cos(Ω_rad) * Math.sin(i_rad) * Math.sin(ω_rad + v_rad));
    const z = x_orbit * (Math.sin(i_rad) * Math.sin(ω_rad + v_rad))
             + y_orbit * (Math.sin(i_rad) * Math.cos(ω_rad + v_rad));
    
    return { x: x_ecl, y: y_ecl, z };
}

// Funzione per convertire le coordinate eclittiche in RA e DEC direttamente
function eclipticToRADEC(x_ecl, y_ecl, z, ε) {
  // Calcolo delle coordinate equatoriali usando l'obliquità ε
  const x_eq = x_ecl;
  const y_eq = y_ecl * Math.cos(ε) - z * Math.sin(ε);
  const z_eq = y_ecl * Math.sin(ε) + z * Math.cos(ε);


  console.log('COORDS equatr TUTTA', x_eq, y_eq, z_eq)

  // Ascensione retta e declinazione
  const ra = Math.atan2(y_eq, x_eq); // Ascensione retta in radianti
  const dec = Math.atan2(z_eq, Math.sqrt(x_eq * x_eq + y_eq * y_eq)); // Declinazione in radianti

  console.log("ra e dec", ra, dec);
  // Converti in gradi
  const toDegrees = (radians) => radians * (180 / Math.PI);

  return { ra: toDegrees(ra), dec: toDegrees(dec) };
}

// Parametri orbitali di Marte
const a = 1.523679; // Semiasse maggiore in AU
const e = 0.0934; // Eccentricità
const i = 1.8497; // Inclinazione in gradi
const Ω = 49.558; // Longitudine dell'ascendente nodo in gradi
const ω = 286.502; // Argomento del periastro in gradi
const v = 55.0418073079899; // Anomalia vera in gradi

// Costante per l'obliquità dell'eclittica
const ε = 0.40911; // Obliquità dell'eclittica in radianti

// Calcolo delle coordinate eclittiche
const eclipticCoords = calculateEclipticCoordinates(a, e, i, Ω, ω, v);
console.log("Coordinate eclittiche:", eclipticCoords);

// Calcolo delle coordinate RA e DEC
const raDecCoords = eclipticToRADEC(
  eclipticCoords.x,
  eclipticCoords.y,
  eclipticCoords.z,
  ε
);
console.log("Ascensione Reatta (RA):", raDecCoords.ra.toFixed(4), "°");
console.log("Declinazione (DEC):", raDecCoords.dec.toFixed(4), "°");
