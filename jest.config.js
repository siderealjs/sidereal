export default {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/?(*.)+(spec|test).[jt]s?(x)"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json",
    },
  },

  transformIgnorePatterns: ["node_modules/", "ephemeris/"],
  testPathIgnorePatterns: [
    "/build/",
    "/config/",
    "/data/",
    "/dist/",
    "/node_modules/",
    "/test/",
    "/vendor/",
    "ephemeris/"
  ],
};
