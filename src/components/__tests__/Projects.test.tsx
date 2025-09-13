import { render, screen } from '@testing-library/react';
import Projects from '../organisms/Projects';
import { IProjectsProps } from '@/interfaces/projects';
import { mockGithubRepo } from '../../testUtils';

describe('Projects Component', () => {
  const defaultProps: IProjectsProps = {
    repos: [
      mockGithubRepo,
      {
        ...mockGithubRepo,
        id: 67891,
        name: 'another-repo',
        description: 'Another test repository',
        language: 'JavaScript',
        html_url: 'https://github.com/testuser/another-repo'
      }
    ]
  };

  it('should render projects section with heading', () => {
    render(<Projects {...defaultProps} />);
    
    const section = screen.getByRole('region');
    expect(section).toBeTruthy();
    expect(section.getAttribute('id')).toBe('projects');
    
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toBeTruthy();
    expect(heading.textContent).toBe('Projects');
  });

  it('should render all repository cards', () => {
    render(<Projects {...defaultProps} />);
    
    const projectLinks = screen.getAllByRole('link');
    expect(projectLinks.length).toBe(2);
    
    const firstProject = screen.getByRole('link', { name: 'test-repo' });
    const secondProject = screen.getByRole('link', { name: 'another-repo' });
    
    expect(firstProject).toBeTruthy();
    expect(secondProject).toBeTruthy();
  });

  it('should render repository information correctly', () => {
    render(<Projects {...defaultProps} />);
    
    // Check first repository
    const firstProjectLink = screen.getByRole('link', { name: 'test-repo' });
    expect(firstProjectLink.getAttribute('href')).toBe('https://github.com/testuser/test-repo');
    expect(firstProjectLink.getAttribute('target')).toBe('_blank');
    
    const firstDescription = screen.getByText('A test repository');
    const firstLanguage = screen.getByText('TypeScript');
    expect(firstDescription).toBeTruthy();
    expect(firstLanguage).toBeTruthy();
    
    // Check second repository
    const secondProjectLink = screen.getByRole('link', { name: 'another-repo' });
    expect(secondProjectLink.getAttribute('href')).toBe('https://github.com/testuser/another-repo');
    
    const secondDescription = screen.getByText('Another test repository');
    const secondLanguage = screen.getByText('JavaScript');
    expect(secondDescription).toBeTruthy();
    expect(secondLanguage).toBeTruthy();
  });

  it('should handle empty repositories array', () => {
    const emptyProps: IProjectsProps = {
      repos: []
    };

    render(<Projects {...emptyProps} />);
    
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading.textContent).toBe('Projects');
    
    const links = screen.queryAllByRole('link');
    expect(links.length).toBe(0);
  });

  it('should handle repository without description', () => {
    const propsWithoutDescription: IProjectsProps = {
      repos: [{
        ...mockGithubRepo,
        description: null
      }]
    };

    render(<Projects {...propsWithoutDescription} />);
    
    const projectLink = screen.getByRole('link', { name: 'test-repo' });
    expect(projectLink).toBeTruthy();
    
    // Description paragraph should still be rendered but empty
    const { container } = render(<Projects {...propsWithoutDescription} />);
    const descriptionParagraph = container.querySelector('p');
    expect(descriptionParagraph?.textContent).toBe('');
  });

  it('should handle repository without language', () => {
    const propsWithoutLanguage: IProjectsProps = {
      repos: [{
        ...mockGithubRepo,
        language: null
      }]
    };

    render(<Projects {...propsWithoutLanguage} />);
    
    const projectLink = screen.getByRole('link', { name: 'test-repo' });
    expect(projectLink).toBeTruthy();
    
    // Language small element should still be rendered but empty
    const { container } = render(<Projects {...propsWithoutLanguage} />);
    const languageElement = container.querySelector('small');
    expect(languageElement?.textContent).toBe('');
  });

  it('should render with correct CSS classes', () => {
    const { container } = render(<Projects {...defaultProps} />);
    
    const section = container.querySelector('#projects');
    expect(section?.className).toContain('tw:grid');
    expect(section?.className).toContain('tw:grid-cols-1');
    expect(section?.className).toContain('tw:px-10');
    expect(section?.className).toContain('tw:lg:px-20');
    expect(section?.className).toContain('tw:gap-4');
    
    const heading = container.querySelector('h2');
    expect(heading?.className).toContain('tw:text-3xl');
    
    const projectsGrid = container.querySelector('div.tw\\:grid-cols-1');
    expect(projectsGrid?.className).toContain('tw:lg:grid-cols-2');
  });

  it('should render project cards with correct styling', () => {
    const { container } = render(<Projects {...defaultProps} />);
    
    const projectCards = container.querySelectorAll('.tw\\:flex.tw\\:flex-col');
    expect(projectCards.length).toBe(2);
    
    projectCards.forEach(card => {
      expect(card.className).toContain('tw:gap-2');
      expect(card.className).toContain('tw:border');
      expect(card.className).toContain('tw:rounded-lg');
      expect(card.className).toContain('tw:px-6');
      expect(card.className).toContain('tw:py-4');
    });
  });

  it('should render project links with hover effects', () => {
    const { container } = render(<Projects {...defaultProps} />);
    
    const projectLinks = container.querySelectorAll('a');
    
    projectLinks.forEach(link => {
      expect(link.className).toContain('tw:text-2xl');
      expect(link.className).toContain('tw:transition');
      expect(link.className).toContain('tw:ease-in-out');
      expect(link.className).toContain('tw:duration-300');
      expect(link.className).toContain('tw:hover:-translate-y-0.5');
      expect(link.className).toContain('tw:hover:-translate-x-0.5');
    });
  });

  it('should use repository id as key', () => {
    const { container } = render(<Projects {...defaultProps} />);
    
    // We can't directly test React keys, but we can verify that each repository is rendered
    const projectCards = container.querySelectorAll('.tw\\:flex.tw\\:flex-col');
    expect(projectCards.length).toBe(2);
    
    // Verify the content is different for each card
    const firstCard = projectCards[0];
    const secondCard = projectCards[1];
    
    expect(firstCard.textContent).toContain('test-repo');
    expect(secondCard.textContent).toContain('another-repo');
  });

  it('should handle single repository', () => {
    const singleRepoProps: IProjectsProps = {
      repos: [mockGithubRepo]
    };

    render(<Projects {...singleRepoProps} />);
    
    const projectLinks = screen.getAllByRole('link');
    expect(projectLinks.length).toBe(1);
    
    const projectLink = screen.getByRole('link', { name: 'test-repo' });
    expect(projectLink).toBeTruthy();
  });
});