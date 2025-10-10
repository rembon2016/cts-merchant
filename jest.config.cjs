module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/test'],
  testMatch: ['**/*.test.js'],
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  moduleFileExtensions: ['js', 'jsx', 'json'],
  setupFiles: ['<rootDir>/test/setupEnv.js'],
  setupFilesAfterEnv: ['<rootDir>/test/setupJest.js'],
  moduleNameMapper: {
    // Mock static assets if needed
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  clearMocks: true,
};
