import { render, screen } from '@testing-library/react';
import Header from '../organisms/Header';
import { IHeaderProps } from '@/interfaces/header';

describe('Header Component', () => {
  const defaultProps: IHeaderProps = {
    title: 'Test Portfolio',
    sections: ['About', 'Projects', 'Contact']
  };

  it('should render header with title', () => {
    render(<Header {...defaultProps} />);
    
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeTruthy();
    expect(heading.textContent).toBe('Test Portfolio');
  });

  it('should render navigation with correct sections', () => {
    render(<Header {...defaultProps} />);
    
    const nav = screen.getByRole('navigation');
    expect(nav).toBeTruthy();

    const aboutLink = screen.getByRole('link', { name: 'About' });
    const projectsLink = screen.getByRole('link', { name: 'Projects' });
    const contactLink = screen.getByRole('link', { name: 'Contact' });

    expect(aboutLink).toBeTruthy();
    expect(projectsLink).toBeTruthy();
    expect(contactLink).toBeTruthy();
  });

  it('should generate correct href attributes for navigation links', () => {
    render(<Header {...defaultProps} />);
    
    const aboutLink = screen.getByRole('link', { name: 'About' });
    const projectsLink = screen.getByRole('link', { name: 'Projects' });
    const contactLink = screen.getByRole('link', { name: 'Contact' });

    expect(aboutLink.getAttribute('href')).toBe('#about');
    expect(projectsLink.getAttribute('href')).toBe('#projects');
    expect(contactLink.getAttribute('href')).toBe('#contact');
  });

  it('should handle sections with extra whitespace', () => {
    const propsWithSpaces: IHeaderProps = {
      title: 'Test Portfolio',
      sections: [' About ', ' Projects ', ' Contact ']
    };

    render(<Header {...propsWithSpaces} />);
    
    // The links show the text with spaces but accessible names are trimmed
    const aboutLink = screen.getByRole('link', { name: 'About' });
    const projectsLink = screen.getByRole('link', { name: 'Projects' });
    const contactLink = screen.getByRole('link', { name: 'Contact' });

    expect(aboutLink.getAttribute('href')).toBe('#about');
    expect(projectsLink.getAttribute('href')).toBe('#projects');
    expect(contactLink.getAttribute('href')).toBe('#contact');
  });

  it('should handle empty sections array', () => {
    const propsEmpty: IHeaderProps = {
      title: 'Test Portfolio',
      sections: []
    };

    render(<Header {...propsEmpty} />);
    
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeTruthy();
    
    const nav = screen.getByRole('navigation');
    expect(nav).toBeTruthy();
    
    const list = nav.querySelector('ul');
    expect(list).toBeTruthy();
    expect(list?.children.length).toBe(0);
  });

  it('should handle single section', () => {
    const propsSingle: IHeaderProps = {
      title: 'Test Portfolio',
      sections: ['About']
    };

    render(<Header {...propsSingle} />);
    
    const aboutLink = screen.getByRole('link', { name: 'About' });
    expect(aboutLink).toBeTruthy();
    expect(aboutLink.getAttribute('href')).toBe('#about');
    
    const links = screen.getAllByRole('link');
    expect(links.length).toBe(1);
  });

  it('should handle sections with different cases', () => {
    const propsWithCases: IHeaderProps = {
      title: 'Test Portfolio',
      sections: ['ABOUT', 'projects', 'ConTact']
    };

    render(<Header {...propsWithCases} />);
    
    const aboutLink = screen.getByRole('link', { name: 'ABOUT' });
    const projectsLink = screen.getByRole('link', { name: 'projects' });
    const contactLink = screen.getByRole('link', { name: 'ConTact' });

    expect(aboutLink.getAttribute('href')).toBe('#about');
    expect(projectsLink.getAttribute('href')).toBe('#projects');
    expect(contactLink.getAttribute('href')).toBe('#contact');
  });

  it('should render with correct CSS classes', () => {
    const { container } = render(<Header {...defaultProps} />);
    
    const header = container.querySelector('header');
    expect(header?.className).toContain('tw:grid');
    expect(header?.className).toContain('tw:grid-cols-1');
    expect(header?.className).toContain('tw:lg:grid-cols-3');

    const heading = container.querySelector('h1');
    expect(heading?.className).toContain('tw:col-span-2');
    expect(heading?.className).toContain('tw:text-4xl');
  });

  it('should render list items with correct CSS classes', () => {
    const { container } = render(<Header {...defaultProps} />);
    
    const listItems = container.querySelectorAll('li');
    
    listItems.forEach(item => {
      expect(item.className).toContain('tw:transition');
      expect(item.className).toContain('tw:ease-in-out');
      expect(item.className).toContain('tw:duration-300');
    });
  });

  it('should use index as key for list items', () => {
    const { container } = render(<Header {...defaultProps} />);
    
    const listItems = container.querySelectorAll('li');
    expect(listItems.length).toBe(3);
    
    expect(listItems[0].textContent).toBe('About');
    expect(listItems[1].textContent).toBe('Projects');
    expect(listItems[2].textContent).toBe('Contact');
  });

  it('should handle special characters in section names', () => {
    const propsSpecialChars: IHeaderProps = {
      title: 'Test Portfolio',
      sections: ['About Me!', 'Projects & Work', 'Contact@Email']
    };

    render(<Header {...propsSpecialChars} />);
    
    const aboutLink = screen.getByRole('link', { name: 'About Me!' });
    const projectsLink = screen.getByRole('link', { name: 'Projects & Work' });
    const contactLink = screen.getByRole('link', { name: 'Contact@Email' });

    expect(aboutLink.getAttribute('href')).toBe('#about me!');
    expect(projectsLink.getAttribute('href')).toBe('#projects & work');
    expect(contactLink.getAttribute('href')).toBe('#contact@email');
  });

  it('should render header element with banner role', () => {
    render(<Header {...defaultProps} />);
    
    const header = screen.getByRole('banner');
    expect(header).toBeTruthy();
    expect(header.tagName.toLowerCase()).toBe('header');
  });
});