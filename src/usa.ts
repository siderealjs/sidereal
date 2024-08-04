import {Constants, CelestialBody} from './index'




const mars = new CelestialBody('mars');
const todayx = new Date('2024-08-04');
const today = new Date('2024-08-04');

console.log(todayx, today)

const ephemerisMars = mars.getEphemerisAtDate(today);

console.log(ephemerisMars)