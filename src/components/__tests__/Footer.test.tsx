import { render, screen } from '@testing-library/react';
import Footer from '../organisms/Footer';
import { IFooterProps } from '@/interfaces/footer';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe('Footer Component', () => {
  const defaultProps: IFooterProps = {
    username: 'testuser',
    profileName: 'Test User',
    contact: {
      email: {
        url: 'mailto:test@example.com',
        icon: { src: '/email.svg', width: 24, height: 24 },
        iconDark: { src: '/email-dark.svg', width: 24, height: 24 }
      },
      linkedin: {
        url: 'https://linkedin.com/in/testuser',
        icon: { src: '/linkedin.svg', width: 24, height: 24 },
        iconDark: { src: '/linkedin-dark.svg', width: 24, height: 24 }
      },
      github: {
        url: 'https://github.com/testuser',
        icon: { src: '/github.svg', width: 24, height: 24 },
        iconDark: { src: '/github-dark.svg', width: 24, height: 24 }
      }
    }
  };

  beforeEach(() => {
    // Reset the mock before each test
    (window.matchMedia as jest.Mock).mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));
  });

  it('should render footer with contact message', () => {
    render(<Footer {...defaultProps} />);
    
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeTruthy();
    expect(footer.getAttribute('id')).toBe('contact');
    
    const message = screen.getByText('You can reach me via:');
    expect(message).toBeTruthy();
  });

  it('should render contact links', () => {
    render(<Footer {...defaultProps} />);
    
    const emailLink = screen.getByRole('link', { name: /email/i });
    const linkedinLink = screen.getByRole('link', { name: /linkedin/i });
    const githubLink = screen.getByRole('link', { name: /github/i });

    expect(emailLink).toBeTruthy();
    expect(linkedinLink).toBeTruthy();
    expect(githubLink).toBeTruthy();
    
    expect(emailLink.getAttribute('href')).toBe('mailto:test@example.com');
    expect(linkedinLink.getAttribute('href')).toBe('https://linkedin.com/in/testuser');
    expect(githubLink.getAttribute('href')).toBe('https://github.com/testuser');
  });

  it('should render images with correct alt text', () => {
    render(<Footer {...defaultProps} />);
    
    const emailImage = screen.getByAltText('Email');
    const linkedinImage = screen.getByAltText('Linkedin');
    const githubImage = screen.getByAltText('Github');

    expect(emailImage).toBeTruthy();
    expect(linkedinImage).toBeTruthy();
    expect(githubImage).toBeTruthy();
  });

  it('should render copyright with current year', () => {
    render(<Footer {...defaultProps} />);
    
    const currentYear = new Date().getFullYear();
    const copyright = screen.getByText(`Built with ❤️ by`);
    const yearText = screen.getByText(`© ${currentYear} all rights reserved`);
    
    expect(copyright).toBeTruthy();
    expect(yearText).toBeTruthy();
  });

  it('should render profile name link', () => {
    render(<Footer {...defaultProps} />);
    
    const profileLink = screen.getByRole('link', { name: 'Test User' });
    expect(profileLink).toBeTruthy();
    expect(profileLink.getAttribute('href')).toBe('https://github.com/testuser');
  });

  it('should use light mode icons by default', () => {
    render(<Footer {...defaultProps} />);
    
    const emailImage = screen.getByAltText('Email');
    expect(emailImage.getAttribute('src')).toBe('/email.svg');
  });

  it('should use dark mode icons when dark mode is preferred', () => {
    // Mock matchMedia to return dark mode preference
    (window.matchMedia as jest.Mock).mockImplementation(query => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    render(<Footer {...defaultProps} />);
    
    const emailImage = screen.getByAltText('Email');
    expect(emailImage.getAttribute('src')).toBe('/email-dark.svg');
  });

  it('should set up dark mode media query listener', () => {
    const mockAddEventListener = jest.fn();
    const mockRemoveEventListener = jest.fn();
    
    (window.matchMedia as jest.Mock).mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: mockAddEventListener,
      removeEventListener: mockRemoveEventListener,
      dispatchEvent: jest.fn(),
    }));

    const { unmount } = render(<Footer {...defaultProps} />);
    
    expect(mockAddEventListener).toHaveBeenCalledWith('change', expect.any(Function));
    
    unmount();
    
    expect(mockRemoveEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });

  it('should render with correct CSS classes', () => {
    const { container } = render(<Footer {...defaultProps} />);
    
    const footer = container.querySelector('footer');
    expect(footer?.className).toContain('tw:grid');
    expect(footer?.className).toContain('tw:grid-cols-1');
    expect(footer?.className).toContain('tw:gap-8');
    expect(footer?.className).toContain('tw:text-center');
  });

  it('should render all links with target blank', () => {
    render(<Footer {...defaultProps} />);
    
    const contactLinks = screen.getAllByRole('link').filter(link => 
      link.getAttribute('href')?.includes('mailto:') || 
      link.getAttribute('href')?.includes('linkedin.com') ||
      (link.getAttribute('href')?.includes('github.com') && link.textContent !== 'Test User')
    );
    
    contactLinks.forEach(link => {
      expect(link.getAttribute('target')).toBe('_blank');
    });
  });

  it('should capitalize contact method names correctly', () => {
    render(<Footer {...defaultProps} />);
    
    // The capitalizeFirstLetter function should capitalize the first letter
    const emailImage = screen.getByAltText('Email');
    const linkedinImage = screen.getByAltText('Linkedin');
    const githubImage = screen.getByAltText('Github');

    expect(emailImage.getAttribute('title')).toBe('Email');
    expect(linkedinImage.getAttribute('title')).toBe('Linkedin');
    expect(githubImage.getAttribute('title')).toBe('Github');
  });
});