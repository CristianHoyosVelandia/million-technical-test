/**
 * Jest Configuration for Million Luxury Frontend
 *
 * Configuración de Jest para testing de:
 * - API Services (WebServices)
 * - React Components
 * - Redux Store
 * - Custom Hooks
 */

export default {
  // Entorno de testing
  testEnvironment: 'jsdom',

  // Extensiones de archivos a testear
  moduleFileExtensions: ['js', 'jsx', 'json'],

  // Transformación de archivos
  transform: {
    '^.+\\.(js|jsx)$': ['babel-jest', {
      presets: [
        ['@babel/preset-env', { modules: 'commonjs' }],
        ['@babel/preset-react', { runtime: 'automatic' }]
      ]
    }],
  },

  // Setup files
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],

  // Module name mapping para imports
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(gif|ttf|eot|svg|png|jpg|jpeg)$': '<rootDir>/__mocks__/fileMock.js',
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  // Directorios a ignorar
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/build/'
  ],

  // Cobertura de código
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/main.jsx',
    '!src/**/*.test.{js,jsx}',
    '!src/**/*.spec.{js,jsx}',
  ],

  // Umbral de cobertura
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },

  // Verbose output
  verbose: true,

  // Clear mocks between tests
  clearMocks: true,

  // Restore mocks between tests
  restoreMocks: true,
};
