module.exports = {
    collectCoverage: true,
    collectCoverageFrom: ['index.js'],
    coverageThreshold: {
        global: {
            branches: 100,
            functions: 100,
            lines: 100,
            statements: 100,
        },
    },
    testEnvironment: 'node',
    testMatch: ['**/__tests__/**/*.(test|spec).js'],
    testPathIgnorePatterns: [
        '/coverage/',
        '/node_modules/',
    ],
}
