import { Constants, CelestialBody } from "./index";

const mars = new CelestialBody("earth");
const todayx = new Date("2024-08-04");
const today = new Date("2024-08-04");

//console.log(todayx, today);

const ephemerisMars = mars.getEphemerisAtDate(today);

console.log(ephemerisMars);



   // Convert degrees to radians
   function degToRad(deg) {
    return deg * (Math.PI / 180);
}

// Convert radians to degrees
function radToDeg(rad) {
    return rad * (180 / Math.PI);
}

function calculateMarsRAandDEC(v_mars, E_mars, a_mars, e_mars, i_mars, w_mars, N_mars, v_earth, E_earth, a_earth, e_earth, i_earth, w_earth, N_earth) {

    // Constants
    const epsilon = degToRad(23.43928); // Obliquity of the ecliptic

    // Calculate distances
    const r_mars = a_mars * (1 - e_mars * Math.cos(E_mars));
    const r_earth = a_earth * (1 - e_earth * Math.cos(E_earth));

    // Calculate heliocentric coordinates in the orbital plane
    const X_orb_mars = r_mars * Math.cos(v_mars);
    const Y_orb_mars = r_mars * Math.sin(v_mars);
    const Z_orb_mars = 0;

    const X_orb_earth = r_earth * Math.cos(v_earth);
    const Y_orb_earth = r_earth * Math.sin(v_earth);
    const Z_orb_earth = 0;

    // Convert orbital plane coordinates to ecliptic coordinates
    function orbitalToEcliptic(X_orb, Y_orb, Z_orb, i, w, N) {
        const cos_w = Math.cos(w);
        const sin_w = Math.sin(w);
        const cos_i = Math.cos(i);
        const sin_i = Math.sin(i);
        const cos_N = Math.cos(N);
        const sin_N = Math.sin(N);

        const X_ecl = (cos_N * cos_w - sin_N * sin_w * cos_i) * X_orb - (cos_N * sin_w + sin_N * cos_w * cos_i) * Y_orb;
        const Y_ecl = (sin_N * cos_w + cos_N * sin_w * cos_i) * X_orb - (sin_N * sin_w - cos_N * cos_w * cos_i) * Y_orb;
        const Z_ecl = (sin_w * sin_i) * X_orb + (cos_w * sin_i) * Y_orb;

        return { X_ecl, Y_ecl, Z_ecl };
    }

    const marsEcl = orbitalToEcliptic(X_orb_mars, Y_orb_mars, Z_orb_mars, degToRad(i_mars), degToRad(w_mars), degToRad(N_mars));
    const earthEcl = orbitalToEcliptic(X_orb_earth, Y_orb_earth, Z_orb_earth, degToRad(i_earth), degToRad(w_earth), degToRad(N_earth));

    // Calculate geocentric coordinates of Mars
    const Xg = marsEcl.X_ecl - earthEcl.X_ecl;
    const Yg = marsEcl.Y_ecl - earthEcl.Y_ecl;
    const Zg = marsEcl.Z_ecl - earthEcl.Z_ecl;

    // Convert geocentric ecliptic coordinates to equatorial coordinates
    const Xe = Xg;
    const Ye = Yg * Math.cos(epsilon) - Zg * Math.sin(epsilon);
    const Ze = Yg * Math.sin(epsilon) + Zg * Math.cos(epsilon);

    // Calculate RA and DEC
    const RA = radToDeg(Math.atan2(Ye, Xe));
    const DEC = radToDeg(Math.asin(Ze / Math.sqrt(Xe * Xe + Ye * Ye + Ze * Ze)));

    return { RA: Math.atan2(Ye, Xe), DEC: Math.asin(Ze / Math.sqrt(Xe * Xe + Ye * Ye + Ze * Ze)) };
}



const v_mars = 0.9517  // Example value, in degrees
const E_mars = 0.8775  // Example value, in degrees
const a_mars = 1.523679;       // Semimajor axis of Mars, in AU
const e_mars = 0.0934;         // Eccentricity of Mars
const i_mars = 1.850;          // Inclination of Mars's orbit, in degrees
const w_mars = 286.5;      // Argument of perihelion of Mars, in degrees
const N_mars = 49.57854;         // Longitude of ascending node of Mars, in degrees

const v_earth = 3.65 // Example value, in degrees
const E_earth = 3.658  // Example value, in degrees
const a_earth = 1.000001018;   // Semimajor axis of Earth, in AU
const e_earth = 0.0167086;     // Eccentricity of Earth
const i_earth = 0.00005;       // Inclination of Earth's orbit, in degrees
const w_earth = 114.20783;  // Argument of perihelion of Earth, in degrees
const N_earth = -11.26064;   

const result = calculateMarsRAandDEC(v_mars, E_mars, a_mars, e_mars, i_mars, w_mars, N_mars, v_earth, E_earth, a_earth, e_earth, i_earth, w_earth, N_earth);
console.log(`RA: ${result.RA.toFixed(2)} rad, DEC: ${result.DEC.toFixed(2)} rad`);
