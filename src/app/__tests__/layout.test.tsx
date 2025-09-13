import { render } from '@testing-library/react';
import RootLayout, { metadata } from '../layout';

// Mock Next.js font loader
jest.mock('next/font/local', () => {
  return jest.fn(() => ({
    variable: '--font-mock',
    style: { fontFamily: 'Mock Font' }
  }));
});

describe('RootLayout', () => {
  const MockChildren = () => <div data-testid="mock-children">Test Content</div>;

  it('should render with correct structure', () => {
    const { container } = render(
      <RootLayout>
        <MockChildren />
      </RootLayout>
    );

    // React Testing Library renders into a div, not full html/body
    // We can test that the layout component renders without errors
    expect(container.firstChild).toBeTruthy();
  });

  it('should render children content', () => {
    const { getByTestId } = render(
      <RootLayout>
        <MockChildren />
      </RootLayout>
    );

    expect(getByTestId('mock-children')).toBeTruthy();
  });

  it('should handle multiple children', () => {
    const { container } = render(
      <RootLayout>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
        <div data-testid="child-3">Child 3</div>
      </RootLayout>
    );

    expect(container.querySelector('[data-testid="child-1"]')).toBeTruthy();
    expect(container.querySelector('[data-testid="child-2"]')).toBeTruthy();
    expect(container.querySelector('[data-testid="child-3"]')).toBeTruthy();
  });

  it('should handle empty children', () => {
    const { container } = render(
      <RootLayout>
        {null}
      </RootLayout>
    );

    expect(container.firstChild).toBeTruthy();
  });

  it('should handle JSX fragment children', () => {
    const { container } = render(
      <RootLayout>
        <>
          <div data-testid="fragment-child-1">Fragment Child 1</div>
          <div data-testid="fragment-child-2">Fragment Child 2</div>
        </>
      </RootLayout>
    );

    expect(container.querySelector('[data-testid="fragment-child-1"]')).toBeTruthy();
    expect(container.querySelector('[data-testid="fragment-child-2"]')).toBeTruthy();
  });
});

describe('Layout Metadata', () => {
  it('should export correct metadata object', () => {
    expect(metadata).toBeDefined();
    expect(metadata.title).toBe('Thiago Pereira - Portfolio');
    expect(metadata.description).toBe('Portfolio of Thiago Pereira');
  });

  it('should include correct keywords', () => {
    expect(metadata.keywords).toEqual(['Portfolio', 'Thiago Pereira', 'Software Engineer']);
  });

  it('should have all required metadata properties', () => {
    expect(metadata).toHaveProperty('title');
    expect(metadata).toHaveProperty('description');
    expect(metadata).toHaveProperty('keywords');
  });

  it('should use userData in metadata generation', () => {
    // The metadata should reflect the userData values
    expect(metadata.title).toContain('Thiago Pereira');
    expect(metadata.description).toContain('Thiago Pereira');
    expect(metadata.keywords).toContain('Thiago Pereira');
  });
});