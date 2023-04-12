import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  verbose: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  testEnvironment: 'node',
  testMatch: ['**/?(*.)+(spec|test).+(ts|tsx|js)'],
  transform: {
    '^.+\\.(ts|tsx|js)$': 'ts-jest',
  },
  moduleNameMapper: {
    '@config/(.*)': ['<rootDir>/src/config/$1'],
    '@constants(.*)': ['<rootDir>/src/constants/$1'],
    '@functions(.*)': ['<rootDir>/src/functions/$1'],
    '@libs(.*)': ['<rootDir>/src/libs/$1'],
    '@services(.*)': ['<rootDir>/src/services/$1'],
    '@typings(.*)': ['<rootDir>/src/typings/$1'],
  },
};

export default config;
