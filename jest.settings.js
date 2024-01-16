module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  roots: ['<rootDir>/packages/'],
  rootDir: '.',
  testTimeout: 10_000,
  testRegex: '.spec.ts$',
};
