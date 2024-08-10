import dataTestEphemeris from "@test-resources/data/planetPositionsEphemeris.json";

export class fixtureEphemeris {
  name: string;
  constructor(name: string) {
    this.name = name;
  }

  getPositionAtDate(date: Date) {

    return dataTestEphemeris[this.name].ecliptic.sun.cartesian;
  }
}
