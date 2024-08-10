import dataTestEphemeris from "../data/planetPositionsEphemeris.json";

export class fixtureEphemeris {
  name: string;
  constructor(name: string) {
    this.name = name;
  }

  getPositionAtDate(date: Date) {
    return dataTestEphemeris[this.name].ecliptic.cartesian;
  }
}
