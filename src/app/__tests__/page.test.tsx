import { render, screen, waitFor } from "@testing-library/react";
import Home from "../page";
import { ServiceFactory } from "@/factories/serviceFactory";
import { IGithubRepository } from "@/interfaces/services";
import { mockGithubUser, mockGithubRepo } from "../../testUtils";

jest.mock("@/helpers/websitedata", () => ({
  websiteProjects: [
    { url: "https://allowed.com", name: "Allowed Site" },
    { url: "https://allowed2.com", name: "Allowed Site 2" },
  ],
  filterIframeAllowed: jest.fn().mockResolvedValue([
    { url: "https://allowed.com", name: "Allowed Site" },
    { url: "https://allowed2.com", name: "Allowed Site 2" },
  ]),
}));

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
      "2 sites",
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

    // Page renders without crashing; Projects section is hidden when data fails
    expect(container.querySelector("main")).toBeTruthy();
    expect(screen.queryByTestId("projects")).toBeNull();
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

    // Page renders without crashing; About section is hidden when data fails
    expect(container.querySelector("main")).toBeTruthy();
    expect(screen.queryByTestId("about")).toBeNull();
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
    expect(main).toBeInTheDocument();
    // Layout is a full-width grid div directly inside main (after the mocked Header)
    const allDivs = main
      ? Array.from(main.querySelectorAll(":scope > div"))
      : [];
    const layoutDiv = allDivs.find((el) => el.className.includes("tw:grid"));
    expect(layoutDiv).toBeTruthy();
    expect(layoutDiv?.className).toContain("tw:gap-24");
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

    // Projects section is hidden when repos is empty
    expect(screen.queryByTestId("projects")).toBeNull();
    expect(screen.getByTestId("website-projects")).toBeTruthy();
  });
});
