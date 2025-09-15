import '@testing-library/jest-dom'
import React from 'react'

// Add React import for JSX
global.React = React

// Global test setup
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock Next.js image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // Extract relevant props and properly handle src prop
    const { src, alt, width, height, className, title } = props;
    return React.createElement('img', {
      src: typeof src === 'object' ? src.src || src.default : src,
      alt,
      width,
      height,
      className,
      title
    })
  },
}))

// Mock Next.js link component
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, ...props }: any) => {
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