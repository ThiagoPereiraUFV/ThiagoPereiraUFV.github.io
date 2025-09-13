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
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Test Portfolio');
  });

  it('should render navigation with correct sections', () => {
    render(<Header {...defaultProps} />);
    
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();

    const aboutLink = screen.getByRole('link', { name: 'About' });
    const projectsLink = screen.getByRole('link', { name: 'Projects' });
    const contactLink = screen.getByRole('link', { name: 'Contact' });

    expect(aboutLink).toBeInTheDocument();
    expect(projectsLink).toBeInTheDocument();
    expect(contactLink).toBeInTheDocument();
  });

  it('should generate correct href attributes for navigation links', () => {
    render(<Header {...defaultProps} />);
    
    const aboutLink = screen.getByRole('link', { name: 'About' });
    const projectsLink = screen.getByRole('link', { name: 'Projects' });
    const contactLink = screen.getByRole('link', { name: 'Contact' });

    expect(aboutLink).toHaveAttribute('href', '#about');
    expect(projectsLink).toHaveAttribute('href', '#projects');
    expect(contactLink).toHaveAttribute('href', '#contact');
  });

  it('should handle sections with extra whitespace', () => {
    const propsWithSpaces: IHeaderProps = {
      title: 'Test Portfolio',
      sections: [' About ', ' Projects ', ' Contact ']
    };

    render(<Header {...propsWithSpaces} />);
    
    const aboutLink = screen.getByRole('link', { name: ' About ' });
    const projectsLink = screen.getByRole('link', { name: ' Projects ' });
    const contactLink = screen.getByRole('link', { name: ' Contact ' });

    expect(aboutLink).toHaveAttribute('href', '#about');
    expect(projectsLink).toHaveAttribute('href', '#projects');
    expect(contactLink).toHaveAttribute('href', '#contact');
  });

  it('should handle empty sections array', () => {
    const propsEmpty: IHeaderProps = {
      title: 'Test Portfolio',
      sections: []
    };

    render(<Header {...propsEmpty} />);
    
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
    
    const list = nav.querySelector('ul');
    expect(list).toBeInTheDocument();
    expect(list?.children).toHaveLength(0);
  });

  it('should handle single section', () => {
    const propsSingle: IHeaderProps = {
      title: 'Test Portfolio',
      sections: ['About']
    };

    render(<Header {...propsSingle} />);
    
    const aboutLink = screen.getByRole('link', { name: 'About' });
    expect(aboutLink).toBeInTheDocument();
    expect(aboutLink).toHaveAttribute('href', '#about');
    
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(1);
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

    expect(aboutLink).toHaveAttribute('href', '#about');
    expect(projectsLink).toHaveAttribute('href', '#projects');
    expect(contactLink).toHaveAttribute('href', '#contact');
  });

  it('should render with correct CSS classes', () => {
    render(<Header {...defaultProps} />);
    
    const header = screen.getByRole('banner');
    expect(header).toHaveClass(
      'tw:grid',
      'tw:grid-cols-1',
      'tw:lg:grid-cols-3',
      'tw:justify-between',
      'tw:gap-y-4',
      'tw:lg:gap-4',
      'tw:px-12',
      'tw:py-5',
      'tw:text-center',
      'tw:lg:text-justify'
    );

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveClass('tw:col-span-2', 'tw:text-4xl');
  });

  it('should render list items with correct CSS classes', () => {
    render(<Header {...defaultProps} />);
    
    const nav = screen.getByRole('navigation');
    const listItems = nav.querySelectorAll('li');
    
    listItems.forEach(item => {
      expect(item).toHaveClass(
        'tw:transition',
        'tw:ease-in-out',
        'tw:duration-300',
        'tw:hover:-translate-y-0.5',
        'tw:hover:-translate-x-0.5'
      );
    });
  });

  it('should use index as key for list items', () => {
    const { container } = render(<Header {...defaultProps} />);
    
    const listItems = container.querySelectorAll('li');
    expect(listItems).toHaveLength(3);
    
    // Each list item should be rendered (we can't directly test keys in React, 
    // but we can verify the structure is correct)
    expect(listItems[0]).toHaveTextContent('About');
    expect(listItems[1]).toHaveTextContent('Projects');
    expect(listItems[2]).toHaveTextContent('Contact');
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

    expect(aboutLink).toHaveAttribute('href', '#about me!');
    expect(projectsLink).toHaveAttribute('href', '#projects & work');
    expect(contactLink).toHaveAttribute('href', '#contact@email');
  });
});