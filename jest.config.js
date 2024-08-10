export default {
  preset: "ts-jest",
  testEnvironment: "node",
  verbose: true, // Questo è equivalente a usare --verbose
  testMatch: ["**/?(*.)+(spec|test).[jt]s?(x)"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  transform: {
    // Applica ts-jest a tutti i file TypeScript tranne quelli che terminano con .test.ts
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.json",
        diagnostics: false,
      },
    ],
  },
};
