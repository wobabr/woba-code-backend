
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup/test-setup.ts'],
  moduleNameMapper: {
    '^@domain/(.*)$': '<rootDir>/src/domain/$1',
    '^@usecases/(.*)$': '<rootDir>/src/domain/usecases/$1',
    '^@entities/(.*)$': '<rootDir>/src/domain/entities/$1',
    '^@repositories/(.*)$': '<rootDir>/src/domain/repositories/$1',
    '^@infra/(.*)$': '<rootDir>/src/infra/$1',
    '^@http/(.*)$': '<rootDir>/src/infra/http/$1',
    '^@controllers/(.*)$': '<rootDir>/src/infra/http/controllers/$1',
    '^@middlewares/(.*)$': '<rootDir>/src/infra/http/middlewares/$1',
    '^@routes/(.*)$': '<rootDir>/src/infra/http/routes/$1',
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^@docs/(.*)$': '<rootDir>/src/docs/$1',
    '^@prisma/(.*)$': '<rootDir>/src/infra/database/prisma/$1'
  },
  testMatch: [
    '<rootDir>/src/__tests__/unit/**/*.test.ts',
    '<rootDir>/src/__tests__/unit/**/*.test.js'
  ],
  collectCoverageFrom: [
    'src/domain/**/*.{ts,js}',
    '!src/__tests__/**',
    '!src/docs/**',
    '!src/scripts/**'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 95,
      functions: 95,
      lines: 98,
      statements: 99
    }
  }
};
