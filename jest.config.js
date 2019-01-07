module.exports = {
  "collectCoverageFrom": [
    "packages/**/*.(ts|tsx)",
    "!packages/**/*.d.(ts|tsx)",
    "!<rootDir>/node_modules/",
    "!<rootDir>/**/build/**/*.*",
    "!<rootDir>/packages/example/**/*.*",
  ],
  "roots": [
    "<rootDir>/packages"
  ],
  "transform": {
    "^.+\\.tsx?$": "ts-jest"
  },
  "testRegex": "(/__tests__/.*\.test)\.tsx?$",
  "moduleFileExtensions": [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node"
  ],
}
