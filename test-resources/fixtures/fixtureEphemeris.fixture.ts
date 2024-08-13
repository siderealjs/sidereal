import dataTestEphemeris from "@test-resources/data/planetPositionsEphemeris.json";

export class fixtureEphemeris {
  name: string;
  coordinatesCenter: 'earth'|'sun';

  constructor(name: string, coordinatesCenter:  "earth" | "sun") {
    this.name = name;
    this.coordinatesCenter = coordinatesCenter;
  }

  getPositionAtDate(date: Date) {
    return dataTestEphemeris[this.name].ecliptic[this.coordinatesCenter].cartesian;
  }
}

// -0.15367818465409666