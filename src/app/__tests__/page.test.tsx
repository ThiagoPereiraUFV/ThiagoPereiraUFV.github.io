import { render, screen, waitFor } from "@testing-library/react";
import Home from "../page";
import { ServiceFactory } from "@/factories/serviceFactory";
import { IGithubRepository } from "@/interfaces/services";
import {
  mockGithubUser,
  mockGithubRepo,
} from "../../testUtils";

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

interface MockWebsiteProjectsProps {
  websites: unknown[];
}

interface MockFooterProps {
  profileName: string;
}

// Mock all the components used in the page
jest.mock("@/components/organisms/Header", () => {
  return function MockHeader(props: MockHeaderProps) {
    return <div data-testid="header">Header: {props.title}</div>;
  };
});

jest.mock("@/components/organisms/About", () => {
  return function MockAbout(props: MockAboutProps) {
    return (
      <div data-testid="about">
        About: {props.aboutUserData.substring(0, 50)}...
      </div>
    );
  };
});

jest.mock("@/components/organisms/Projects", () => {
  return function MockProjects(props: MockProjectsProps) {
    return (
      <div data-testid="projects">Projects: {props.repos.length} repos</div>
    );
  };
});

jest.mock("@/components/organisms/WebsiteProjects", () => {
  return function MockWebsiteProjects(props: MockWebsiteProjectsProps) {
    return (
      <div data-testid="website-projects">
        Websites: {props.websites.length} sites
      </div>
    );
  };
});

jest.mock("@/components/organisms/Footer", () => {
  return function MockFooter(props: MockFooterProps) {
    return <div data-testid="footer">Footer: {props.profileName}</div>;
  };
});

// Mock the ServiceFactory
jest.mock("@/factories/serviceFactory");

describe("Home Page", () => {
  let mockGithubRepository: jest.Mocked<IGithubRepository>;

  beforeEach(() => {
    mockGithubRepository = {
      getGithubData: jest.fn(),
      getGithubUserData: jest.fn(),
      getGithubUserRepos: jest.fn(),
      getGithubRawFile: jest.fn(),
    };

    (ServiceFactory.getGithubRepository as jest.Mock).mockReturnValue(
      mockGithubRepository,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render all components when data loads successfully", async () => {
    const githubData = {
      ...mockGithubUser,
      repos: [mockGithubRepo],
    };

    const aboutData = "# About Me\n\nI am a developer who loves coding!";

    mockGithubRepository.getGithubData.mockResolvedValue(githubData);
    mockGithubRepository.getGithubRawFile.mockResolvedValue(aboutData);

    render(await Home());

    await waitFor(() => {
      expect(screen.getByTestId("header")).toBeTruthy();
      expect(screen.getByTestId("about")).toBeTruthy();
      expect(screen.getByTestId("projects")).toBeTruthy();
      expect(screen.getByTestId("website-projects")).toBeTruthy();
      expect(screen.getByTestId("footer")).toBeTruthy();
    });

    expect(screen.getByTestId("header").textContent).toContain(
      "Thiago Pereira",
    );
    expect(screen.getByTestId("about").textContent).toContain("# About Me");
    expect(screen.getByTestId("projects").textContent).toContain("1 repos");
    expect(screen.getByTestId("website-projects").textContent).toContain(
      "10 sites",
    );
    expect(screen.getByTestId("footer").textContent).toContain(
      "Thiago Pereira",
    );
  });

  it("should render error message when github data fails", async () => {
    const errorResponse = {
      error: {
        message: "GitHub API rate limit exceeded",
        status: 403,
      },
    };

    mockGithubRepository.getGithubData.mockResolvedValue(errorResponse);

    const result = await Home();
    const { container } = render(result);

    expect(container.textContent).toContain("GitHub API rate limit exceeded");
  });

  it("should render error message when about data fails", async () => {
    const githubData = {
      ...mockGithubUser,
      repos: [mockGithubRepo],
    };

    const aboutError = {
      error: {
        message: "README.md not found",
        status: 404,
      },
    };

    mockGithubRepository.getGithubData.mockResolvedValue(githubData);
    mockGithubRepository.getGithubRawFile.mockResolvedValue(aboutError);

    const result = await Home();
    const { container } = render(result);

    expect(container.textContent).toContain("README.md not found");
  });

  it("should call repository methods with correct parameters", async () => {
    const githubData = {
      ...mockGithubUser,
      repos: [mockGithubRepo],
    };
    const aboutData = "# About Me";

    mockGithubRepository.getGithubData.mockResolvedValue(githubData);
    mockGithubRepository.getGithubRawFile.mockResolvedValue(aboutData);

    await Home();

    expect(mockGithubRepository.getGithubData).toHaveBeenCalledWith(
      "ThiagoPereiraUFV",
    );
    expect(mockGithubRepository.getGithubRawFile).toHaveBeenCalledWith({
      owner: "ThiagoPereiraUFV",
      repo: "ThiagoPereiraUFV",
      branch: "main",
      filepath: "README.md",
    });
  });

  it("should pass correct props to Header component", async () => {
    const githubData = {
      ...mockGithubUser,
      repos: [mockGithubRepo],
    };
    const aboutData = "# About Me";

    mockGithubRepository.getGithubData.mockResolvedValue(githubData);
    mockGithubRepository.getGithubRawFile.mockResolvedValue(aboutData);

    render(await Home());

    const header = screen.getByTestId("header");
    expect(header.textContent).toContain("Thiago Pereira");
  });

  it("should pass correct props to Projects component", async () => {
    const githubData = {
      ...mockGithubUser,
      repos: [mockGithubRepo, { ...mockGithubRepo, id: 67891, name: "repo2" }],
    };
    const aboutData = "# About Me";

    mockGithubRepository.getGithubData.mockResolvedValue(githubData);
    mockGithubRepository.getGithubRawFile.mockResolvedValue(aboutData);

    render(await Home());

    const projects = screen.getByTestId("projects");
    expect(projects.textContent).toContain("2 repos");
  });

  it("should render main element with correct CSS classes", async () => {
    const githubData = {
      ...mockGithubUser,
      repos: [mockGithubRepo],
    };
    const aboutData = "# About Me";

    mockGithubRepository.getGithubData.mockResolvedValue(githubData);
    mockGithubRepository.getGithubRawFile.mockResolvedValue(aboutData);

    const { container } = render(await Home());

    const main = container.querySelector("main");
    expect(main?.className).toContain("tw:grid");
    expect(main?.className).toContain("tw:grid-cols-1");
    expect(main?.className).toContain("tw:gap-10");
    expect(main?.className).toContain("tw:py-4");
  });

  it("should handle empty repositories array", async () => {
    const githubData = {
      ...mockGithubUser,
      repos: [],
    };
    const aboutData = "# About Me";

    mockGithubRepository.getGithubData.mockResolvedValue(githubData);
    mockGithubRepository.getGithubRawFile.mockResolvedValue(aboutData);

    render(await Home());

    const projects = screen.getByTestId("projects");
    expect(projects.textContent).toContain("0 repos");
  });

});
