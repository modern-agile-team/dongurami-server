module.exports = {
  testEnvironment: 'node',
  bail: true,
  verbose: true,
  testRegex: '(/tests/.*[.](test|spec))\\.(ts|tsx|js)$',
  moduleFileExtensions: ['js', 'json', 'jsx', 'ts', 'tsx', 'json'],
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
  coveragePathIgnorePatterns: ['/node_modules/'],
};
