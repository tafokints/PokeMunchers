/** @type {import('jest').Config} */
export default {
    transform: {
        "^.+\\.js$": ["babel-jest", { configFile: './babel.config.js' }]
    },
    moduleNameMapper: {
        "\\.(css|less|sass|scss)$": "<rootDir>/__mocks__/styleMock.js",
        "\\.(gif|ttf|eot|svg|png)$": "<rootDir>/__mocks__/fileMock.js"
    },
    testEnvironment: "node",
    moduleFileExtensions: ["js"],
    transformIgnorePatterns: [],
    testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js']
};