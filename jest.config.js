module.exports = {
  testEnvironment: 'node',
  collectCoverage: true,
  coverageReporters: ['clover', 'json', 'lcov', ['text', {skipFull: true}]],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  roots: ['<rootDir>/test'],
  testMatch: ['**/*.test.js'],
};
