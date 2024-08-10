import dataTestEphemeris from "@test-resources/data/planetPositionsEphemeris.json";

export class fixtureEphemeris {
  name: string;
  constructor(name: string) {
    this.name = name;
  }

  getPositionAtDate(date: Date) {

    console.log('sono dentro 11 e ilpianete e', this.name, dataTestEphemeris[this.name].ecliptic.cartesian)
    return dataTestEphemeris[this.name].ecliptic.cartesian;
  }
}
