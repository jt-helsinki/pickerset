'use strict';

module.exports = {
    "testEnvironment": "jsdom",
    "setupFilesAfterEnv": [
    ],
    "coverageReporters": [
        "lcov"
    ],
    "collectCoverageFrom": [
        "<rootDir>/src/**/?(*.)+(spec|test).[jt]s?(x)",
        "!<rootDir>/test/**/?(*.)+(spec|test).[jt]s?(x)",
        "!<rootDir>/src/**/*.d.ts"
    ],
    "coverageThreshold": {
        "global": {
            "branches": 75,
            "functions": 80,
            "lines": 80,
            "statements": 80
        }
    },
    "testMatch": [
        "<rootDir>/test/**/?(*.)+(spec|test).[jt]s?(x)"
    ],
    "transform": {
        "^.+\\.(js|jsx|mjs)$": "<rootDir>/node_modules/babel-jest",
        "^.+\\.(tsx|ts|js|jsx)$": "<rootDir>/config/typescriptTransform.js"
    },
    "transformIgnorePatterns": [
    ],
    "moduleNameMapper": {
        "@src/(.*)": "<rootDir>/src/$1",
        "@test/(.*)": "<rootDir>/test/$1"
    },
    "moduleFileExtensions": [
        "ts",
        "tsx",
        "js",
        "jsx",
        "json",
        "css",
        "node"
    ]
};
