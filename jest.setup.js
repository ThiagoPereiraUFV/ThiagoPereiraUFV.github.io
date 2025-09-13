import '@testing-library/jest-dom'

// Global test setup
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock Next.js image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    return React.createElement('img', props)
  },
}))

// Mock Next.js link component
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, ...props }) => {
    return React.createElement('a', props, children)
  },
}))

// Mock Next.js font
jest.mock('next/font/local', () => ({
  __esModule: true,
  default: () => ({
    variable: '--font-test',
  }),
}))

// Add React import for JSX
import React from 'react'
global.React = React