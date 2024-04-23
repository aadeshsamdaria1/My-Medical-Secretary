module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: [
    '@testing-library/jest-native/extend-expect',
    '<rootDir>/jest.setup.js' // Add this line and adjust the path as necessary
  ],
  transformIgnorePatterns: [
    "node_modules/(?!(@react-native|react-native))"
  ],
};

  