module.exports = {
  preset: 'ts-jest',
  testRegex: '(./.*.(test|spec)).(ts)$',
  // moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  // collectCoverage: true,
  coveragePathIgnorePatterns: ['(.*.mock).(jsx?|tsx?)$'],
  // verbose: true,
  testEnvironment: 'node',
  snapshotResolver: '<rootDir>/testing/snapshotResolver.js'
};
