import { render, screen, waitFor } from '@testing-library/react';
import Home from '../page';
import { ServiceFactory } from '@/factories/serviceFactory';
import { IGithubRepository, ILowCodeRepository } from '@/interfaces/services';
import { mockGithubUser, mockGithubRepo, mockLowCodeProject } from '../../testUtils';

// Define interfaces for mock component props
interface MockHeaderProps {
  title: string;
}

interface MockAboutProps {
  aboutUserData: string;
}

interface MockProjectsProps {
  repos: unknown[];
}

interface MockLowCodeProjectsProps {
  projects: unknown[];
}

interface MockFooterProps {
  profileName: string;
}

// Mock all the components used in the page
jest.mock('@/components/organisms/Header', () => {
  return function MockHeader(props: MockHeaderProps) {
    return <div data-testid="header">Header: {props.title}</div>;
  };
});

jest.mock('@/components/organisms/About', () => {
  return function MockAbout(props: MockAboutProps) {
    return <div data-testid="about">About: {props.aboutUserData.substring(0, 50)}...</div>;
  };
});

jest.mock('@/components/organisms/Projects', () => {
  return function MockProjects(props: MockProjectsProps) {
    return <div data-testid="projects">Projects: {props.repos.length} repos</div>;
  };
});

jest.mock('@/components/organisms/LowCodeProjects', () => {
  return function MockLowCodeProjects(props: MockLowCodeProjectsProps) {
    return <div data-testid="low-code-projects">LowCode: {props.projects.length} projects</div>;
  };
});

jest.mock('@/components/organisms/Footer', () => {
  return function MockFooter(props: MockFooterProps) {
    return <div data-testid="footer">Footer: {props.profileName}</div>;
  };
});

// Mock the ServiceFactory
jest.mock('@/factories/serviceFactory');

describe('Home Page', () => {
  let mockGithubRepository: jest.Mocked<IGithubRepository>;
  let mockLowCodeRepository: jest.Mocked<ILowCodeRepository>;

  beforeEach(() => {
    mockGithubRepository = {
      getGithubData: jest.fn(),
      getGithubUserData: jest.fn(),
      getGithubUserRepos: jest.fn(),
      getGithubRawFile: jest.fn(),
    };

    mockLowCodeRepository = {
      getLowCodeProjects: jest.fn(),
    };

    (ServiceFactory.getGithubRepository as jest.Mock).mockReturnValue(mockGithubRepository);
    (ServiceFactory.getLowCodeRepository as jest.Mock).mockReturnValue(mockLowCodeRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render all components when data loads successfully', async () => {
    const githubData = {
      ...mockGithubUser,
      repos: [mockGithubRepo]
    };

    const aboutData = '# About Me\n\nI am a developer who loves coding!';

    mockGithubRepository.getGithubData.mockResolvedValue(githubData);
    mockGithubRepository.getGithubRawFile.mockResolvedValue(aboutData);
    mockLowCodeRepository.getLowCodeProjects.mockResolvedValue([mockLowCodeProject]);

    render(await Home());

    await waitFor(() => {
      expect(screen.getByTestId('header')).toBeTruthy();
      expect(screen.getByTestId('about')).toBeTruthy();
      expect(screen.getByTestId('projects')).toBeTruthy();
      expect(screen.getByTestId('low-code-projects')).toBeTruthy();
      expect(screen.getByTestId('footer')).toBeTruthy();
    });

    expect(screen.getByTestId('header').textContent).toContain('Thiago Pereira');
    expect(screen.getByTestId('about').textContent).toContain('# About Me');
    expect(screen.getByTestId('projects').textContent).toContain('1 repos');
    expect(screen.getByTestId('low-code-projects').textContent).toContain('1 projects');
    expect(screen.getByTestId('footer').textContent).toContain('Thiago Pereira');
  });

  it('should render error message when github data fails', async () => {
    const errorResponse = {
      error: {
        message: 'GitHub API rate limit exceeded',
        status: 403
      }
    };

    mockGithubRepository.getGithubData.mockResolvedValue(errorResponse);

    const result = await Home();
    const { container } = render(result);

    expect(container.textContent).toContain('GitHub API rate limit exceeded');
  });

  it('should render error message when about data fails', async () => {
    const githubData = {
      ...mockGithubUser,
      repos: [mockGithubRepo]
    };

    const aboutError = {
      error: {
        message: 'README.md not found',
        status: 404
      }
    };

    mockGithubRepository.getGithubData.mockResolvedValue(githubData);
    mockGithubRepository.getGithubRawFile.mockResolvedValue(aboutError);

    const result = await Home();
    const { container } = render(result);

    expect(container.textContent).toContain('README.md not found');
  });

  it('should render error message when low code projects fail', async () => {
    const githubData = {
      ...mockGithubUser,
      repos: [mockGithubRepo]
    };
    const aboutData = '# About Me\n\nI am a developer!';

    mockGithubRepository.getGithubData.mockResolvedValue(githubData);
    mockGithubRepository.getGithubRawFile.mockResolvedValue(aboutData);
    
    const lowCodeError = {
      error: {
        message: 'Service unavailable',
        status: 503
      }
    };
    mockLowCodeRepository.getLowCodeProjects.mockResolvedValue(lowCodeError);

    const result = await Home();
    const { container } = render(result);

    expect(container.textContent).toContain('Service unavailable');
  });

  it('should call repository methods with correct parameters', async () => {
    const githubData = {
      ...mockGithubUser,
      repos: [mockGithubRepo]
    };
    const aboutData = '# About Me';

    mockGithubRepository.getGithubData.mockResolvedValue(githubData);
    mockGithubRepository.getGithubRawFile.mockResolvedValue(aboutData);
    mockLowCodeRepository.getLowCodeProjects.mockResolvedValue([mockLowCodeProject]);

    await Home();

    expect(mockGithubRepository.getGithubData).toHaveBeenCalledWith('ThiagoPereiraUFV');
    expect(mockGithubRepository.getGithubRawFile).toHaveBeenCalledWith({
      owner: 'ThiagoPereiraUFV',
      repo: 'ThiagoPereiraUFV',
      branch: 'main',
      filepath: 'README.md'
    });
    expect(mockLowCodeRepository.getLowCodeProjects).toHaveBeenCalled();
  });

  it('should pass correct props to Header component', async () => {
    const githubData = {
      ...mockGithubUser,
      repos: [mockGithubRepo]
    };
    const aboutData = '# About Me';

    mockGithubRepository.getGithubData.mockResolvedValue(githubData);
    mockGithubRepository.getGithubRawFile.mockResolvedValue(aboutData);
    mockLowCodeRepository.getLowCodeProjects.mockResolvedValue([]);

    render(await Home());

    const header = screen.getByTestId('header');
    expect(header.textContent).toContain('Thiago Pereira');
  });

  it('should pass correct props to Projects component', async () => {
    const githubData = {
      ...mockGithubUser,
      repos: [mockGithubRepo, { ...mockGithubRepo, id: 67891, name: 'repo2' }]
    };
    const aboutData = '# About Me';

    mockGithubRepository.getGithubData.mockResolvedValue(githubData);
    mockGithubRepository.getGithubRawFile.mockResolvedValue(aboutData);
    mockLowCodeRepository.getLowCodeProjects.mockResolvedValue([]);

    render(await Home());

    const projects = screen.getByTestId('projects');
    expect(projects.textContent).toContain('2 repos');
  });

  it('should pass correct props to LowCodeProjects component', async () => {
    const githubData = {
      ...mockGithubUser,
      repos: [mockGithubRepo]
    };
    const aboutData = '# About Me';

    mockGithubRepository.getGithubData.mockResolvedValue(githubData);
    mockGithubRepository.getGithubRawFile.mockResolvedValue(aboutData);
    mockLowCodeRepository.getLowCodeProjects.mockResolvedValue([mockLowCodeProject, mockLowCodeProject]);

    render(await Home());

    const lowCodeProjects = screen.getByTestId('low-code-projects');
    expect(lowCodeProjects.textContent).toContain('2 projects');
  });

  it('should render main element with correct CSS classes', async () => {
    const githubData = {
      ...mockGithubUser,
      repos: [mockGithubRepo]
    };
    const aboutData = '# About Me';

    mockGithubRepository.getGithubData.mockResolvedValue(githubData);
    mockGithubRepository.getGithubRawFile.mockResolvedValue(aboutData);
    mockLowCodeRepository.getLowCodeProjects.mockResolvedValue([]);

    const { container } = render(await Home());

    const main = container.querySelector('main');
    expect(main?.className).toContain('tw:grid');
    expect(main?.className).toContain('tw:grid-cols-1');
    expect(main?.className).toContain('tw:gap-10');
    expect(main?.className).toContain('tw:py-4');
  });

  it('should handle empty repositories array', async () => {
    const githubData = {
      ...mockGithubUser,
      repos: []
    };
    const aboutData = '# About Me';

    mockGithubRepository.getGithubData.mockResolvedValue(githubData);
    mockGithubRepository.getGithubRawFile.mockResolvedValue(aboutData);
    mockLowCodeRepository.getLowCodeProjects.mockResolvedValue([]);

    render(await Home());

    const projects = screen.getByTestId('projects');
    expect(projects.textContent).toContain('0 repos');
  });

  it('should handle empty low code projects array', async () => {
    const githubData = {
      ...mockGithubUser,
      repos: [mockGithubRepo]
    };
    const aboutData = '# About Me';

    mockGithubRepository.getGithubData.mockResolvedValue(githubData);
    mockGithubRepository.getGithubRawFile.mockResolvedValue(aboutData);
    mockLowCodeRepository.getLowCodeProjects.mockResolvedValue([]);

    render(await Home());

    const lowCodeProjects = screen.getByTestId('low-code-projects');
    expect(lowCodeProjects.textContent).toContain('0 projects');
  });
});