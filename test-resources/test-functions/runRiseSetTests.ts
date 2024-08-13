import Sidereal from "../../src/index";
import { AstroDate } from "@models/AstroDate";

export const runAllPlanetRiseSetTests = (
  data: any,
  testDate: AstroDate
) => {
  for (const planetName in data) {
    if (
      planetName !== "earth" &&
      planetName !== "moon" &&
      planetName !== "sun"
    ) {
      runSingleBodyRiseSetTests(
        planetName,
        data,
        testDate
      );
    }
  }
};

export const runSingleBodyRiseSetTests = (
  planetName: string,
  data: any,
  testDate: AstroDate,
  entity: 'sun'|'planet' = "planet"
) => {
  const expectedCoords = data[planetName].riseSet;

  const sid = new Sidereal();
  const planet = sid[entity](planetName as any);
  const { set, rise } = planet.getRiseAndSetTimeAtDate(testDate)

  expect(`${planetName} ${set.toUTCString()}`).toBe(`${planetName} ${expectedCoords.set}`);
  expect(`${planetName} ${rise.toUTCString()}`).toBe(`${planetName} ${expectedCoords.rise}`);
};
