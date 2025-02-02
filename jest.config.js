export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/*.spec.ts'],
    moduleFileExtensions: ['ts', 'js', 'json'],
    coverageDirectory: 'coverage',
    clearMocks: true,

    extensionsToTreatAsEsm: ['.ts'],
    transform: {
        '^.+\\.ts$': [
            'ts-jest'
        ],
    },
    setupFilesAfterEnv: ['<rootDir>/src/frontend-api-service/fastify.d.ts']
}
