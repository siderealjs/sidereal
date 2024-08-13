# Sidereal

Sidereal is a JavaScript library designed for astronomical calculations. 

It provides a set of APIs for determining the positions of celestial bodies, their celestial observables and performing orbital transfers and other related calculations.

## Features

- **Celestial Body Positions:** Calculate the positions of planets, stars, and other celestial objects.
- **Celestial Observables:** Retrieve various observable attributes of celestial bodies, including apparent magnitudes, rise and set times, and current constellation information.
- **Orbital Transfers:** Perform calculations for orbital transfers and related computations.


## Installation

To install Sidereal, use npm:

```bash
npm install sidereal
```



## Documentation

Comprehensive documentation and API details will be available on the official website in the near future. Stay tuned for updates!


## Accuracy

Sidereal provides accurate astronomical calculations using built-in algorithms, but to keep the bundle size small, it does not include precomputed ephemerides. As a result, there may be a modest margin of error in the calculations. See the [Basic usage](#basic-usage) section below to understand the scale of this error.

For higher precision, you can use Sidereal with [Sidereal-Ephemeris](https://github.com/siderealjs/sidereal-ephemeris), which incorporates JPL ephemerides. Together, they can achieve errors as small as 0.0832° as shown in [this example](#fff).

For more on Sidereal-Ephemeris, visit the [GitHub repository](https://github.com/siderealjs/sidereal-ephemeris).


## Basic usage

Here is a basic example of how to use Sidereal to get the position of a celestial body:

```javascript
import Sidereal from "sidereal";

const sidereal = new Sidereal();

const mars = sidereal.planet('mars');

const date = new sidereal.AstroDate(2024, 6, 22, 0, 0)
const coordinatesCenter = "earth";

const marsPosition = mars.getPositionAtDate(date, coordinatesCenter);

const { spherical, cartesian } = marsPosition.getEquatorialCoords();

console.log('Geocentric equatorial coordinates of Mars on 22th June 2024 at 00:00 UTC');
console.log('Cartesian: (', cartesian.x, ',', cartesian.y, ',', cartesian.z, ')' )
console.log('Spherical: (', spherical.RA.HMS(), ',', spherical.DEC.DMS(), ')' )

```

Result:
```
Geocentric equatorial coordinates of Mars on 22th June 2024 at 00:00 UTC
Cartesian: ( 1.3514278051653246 , 1.0349003612244017 , 0.47248222985938937 )
Spherical: ( 02h 29m 47s , +15° 30' 48" )
```
Expected result [[J2000](https://theskylive.com/planetarium?objects=sun-moon-mars-venus-neptune-mercury-jupiter-saturn-uranus-pluto&localdata=51.4887%7C-0.5273%7CColnbrook%2C+United+Kingdom%7CEurope%2FLondon%7C0&obj=mars&h=23&m=00&date=2024-06-21#ra|2.4677966786519114|dec|13.53825650888569|fov|50)]
```
RA 02h 28m 04s  Dec  +13° 32' 18"

RA error = 0.5417°
Dec error = 1.975°
Total Angular error: 2.043°
```


### Usage with sidereal-ephemeris

```javascript

import Sidereal from "sidereal";
import { loadEphemeris } from "sidereal-ephemeris";


const sidereal = new Sidereal();

const venusEphemeris = loadEphemeris('venus');
const earthEphemeris = loadEphemeris("earth");

sidereal.useEphemeris([venusEphemeris, earthEphemeris])

const venus = sidereal.planet('venus');

const date = new sidereal.AstroDate(2020, 6, 22, 0, 0)
const coordinatesCenter = "earth";

const marsPosition = venus.getPositionAtDate(date, coordinatesCenter);

const { spherical } = marsPosition.getEquatorialCoords();


console.log('RA', spherical.RA.HMS(), ', Dec', spherical.DEC.DMS(), ')' )
```

Result
```

RA 04h 15m 44s Dec +18° 02' 45" 

```

Expected result ([J2000](https://theskylive.com/planetarium?objects=sun-moon-venus-neptune-mars-mercury-jupiter-saturn-uranus-pluto&localdata=51.4887%7C-0.5273%7CColnbrook%2C+United+Kingdom%7CEurope%2FLondon%7C0&obj=venus&h=23&m=00&date=2020-06-21#ra|4.262867489688309|dec|18.04620603036221|fov|NaN))
```
RA 04h 15m 46s  Dec  +18° 02' 46"
RA error: 0.0833°
Dec error: 0.0042°
Total angular error: 0.0832°
```

## License

Sidereal is licensed under the [MIT License](https://github.com/siderealjs/sidereal?tab=MIT-1-ov-file#readme).