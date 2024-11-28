export default {
    moduleFileExtensions: ["js", "json", "ts"],
    rootDir: ".",
    testEnvironment: "node",
    testRegex: ".*\\.spec\\.ts$",
    transform: {
      "^.+\\.(t|j)s$": "ts-jest"
    },
    moduleNameMapper: {
      "^@shared/(.*)$": "<rootDir>/../shared/$1",
      '^src/(.*)$': '<rootDir>/src/$1'
    },
    collectCoverageFrom: ["**/*.(t|j)s"],
    coverageDirectory: "../coverage"
  };