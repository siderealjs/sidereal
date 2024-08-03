import {Constants, CelestialBody} from './index'


console.log(Constants.G)


const mars = new CelestialBody('mars');
const today = new Date();

const ephemerisMars = mars.getEphemerisAtDate(today);

console.log(ephemerisMars)