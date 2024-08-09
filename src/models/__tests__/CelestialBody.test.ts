/* eslint-disable */

import { Planet } from "../body/Planet";
import { CelestialBodyName } from "./../../types/ObjectName.type";

describe.only("Models:: CelestialBody,", () => {
  describe.only("getEphemerisAtDate", () => {
    it("should predict DEC and RA for every planet", () => {
      const date = new Date("2020-03-15");

      const allPlanetsNames = {
        mercury: { ra: 5.803902219077122, dec: -0.19174341561674915 },
        venus: { ra: 0.6728278332321436, dec: 0.3046663080813771 },
        mars: { ra: 5.084625359743531, dec: -0.3956193328824849 },
        jupiter: { ra: 5.127577665455952, dec: -0.3782635734090795 },
        saturn: { ra: 5.268375163543864, dec: -0.35373824371977436 },
        uranus: { ra: 0.5591985003500604, dec: 0.21755767949425026 },
        neptune: { ra: 6.10540859412257, dec: -0.09585449138069731 },
        pluto: { ra: 5.169058817422725, dec: -0.38372391773330455 },
      };

      for (const planetName in allPlanetsNames) {
        const planet = new Planet(planetName as CelestialBodyName);

        const { RA, DEC } = planet.getPositionAtDate(date).getEquatorialCoords().spherical;
        // @ts-ignore
        const expected = allPlanetsNames[planetName as any] as any;

        expect(RA.radians()).toBeCloseTo(expected.ra, 1e-6);
        expect(DEC.radians()).toBeCloseTo(expected.dec, 1e-6);
      }
    });
  });
});
