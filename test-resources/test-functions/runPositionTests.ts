import { fixtureEphemeris } from "@test-resources/fixtures/fixtureEphemeris.fixture";
import Sidereal from "../../src/index";
import { AstroDate } from "@models/AstroDate";

export const runAllPlanetPositionTests = (
  data: any,
  referenceBody: "sun" | "earth",
  useEphemeris: boolean,
  testDate: AstroDate
) => {
  for (const planetName in data) {
    if (
      planetName !== "earth" &&
      planetName !== "moon" &&
      planetName !== "sun"
    ) {
      runSingleBodyPositionTests(
        planetName,
        data,
        referenceBody,
        useEphemeris,
        testDate
      );
    }
  }
};

export const runSingleBodyPositionTests = (
  planetName: string,
  data: any,
  referenceBody: "sun" | "earth",
  useEphemeris: boolean,
  testDate: AstroDate,
  entity: "sun" | "planet" | "earth" | "moon" = "planet"
) => {
  const expectedCoords = data[planetName].ecliptic[referenceBody].cartesian;

  const sid = new Sidereal();
  if (useEphemeris) {
    const fkEphPlanet = new fixtureEphemeris(planetName, "sun");
    const fkEphEarth = new fixtureEphemeris("earth", "sun");
    sid.useEphemeris([fkEphEarth, fkEphPlanet]);
  }

  const planet = sid[entity](planetName as any);
  const { x, y, z } = planet
    .getPositionAtDate(testDate, referenceBody)
    .getEclipticCoords().cartesian;

  expect(`${planetName} ${x}`).toBe(`${planetName} ${expectedCoords.x}`);
  expect(`${planetName} ${y}`).toBe(`${planetName} ${expectedCoords.y}`);
  expect(`${planetName} ${z}`).toBe(`${planetName} ${expectedCoords.z}`);
};
