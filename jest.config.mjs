import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"],
  collectCoverageFrom: [
    "src/**/*.{js,ts,jsx,tsx}",
    "!src/**/*.d.ts",
    "!src/app/fonts/**",
    "!src/assets/**",
  ],
  coverageThreshold: {
    global: {
      branches: 96,
      functions: 100,
      lines: 100,
      statements: 98,
    },
  },
  testMatch: [
    "<rootDir>/src/**/__tests__/**/*.{js,ts,tsx}",
    "<rootDir>/src/**/*.{test,spec}.{js,ts,tsx}",
  ],
  moduleDirectories: ["node_modules", "<rootDir>/"],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": ["babel-jest", { presets: ["next/babel"] }],
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};

export default createJestConfig(customJestConfig);
