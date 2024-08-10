export default {
  preset: "ts-jest",
  testEnvironment: "node",
  verbose: true, // Questo è equivalente a usare --verbose
  testMatch: ["**/?(*.)+(spec|test).[jt]s?(x)"],
  moduleNameMapper: {
    "^@test-resources/(.*)$": "<rootDir>/test-resources/$1",
    "^@test-resources/(.*)$": "<rootDir>/test-resources/$1",
    "^@models/(.*)$": "<rootDir>/src/models/$1",
    "^@types$": "<rootDir>/src/types/index.ts", // Import senza wildcard, quindi niente `$1`
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.json",
        diagnostics: false,
      },
    ],
  },
};
