module.exports = {
  verbose: true,
  transformIgnorePatterns: [
    "node_modules/?!@polkadot/*"
  ],
  "collectCoverage": true,
  "coverageReporters": [
    "text",
    "cobertura"
  ]
};