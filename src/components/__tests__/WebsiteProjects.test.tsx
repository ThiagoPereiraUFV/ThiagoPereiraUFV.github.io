import { render, screen, fireEvent, act } from "@testing-library/react";
import WebsiteProjects from "../organisms/WebsiteProjects";
import WebsiteCard from "../atoms/WebsiteCard";
import { IWebsiteProject } from "@/interfaces/website-projects";

// Mock ResizeObserver
const mockResizeObserver = jest.fn(() => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
  unobserve: jest.fn(),
}));
global.ResizeObserver = mockResizeObserver;

// Mock IntersectionObserver — immediately signals intersection so iframe renders
const mockIntersectionObserver = jest.fn(
  (callback: IntersectionObserverCallback) => ({
    observe: jest.fn((el: Element) => {
      callback(
        [{ isIntersecting: true, target: el } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    }),
    disconnect: jest.fn(),
    unobserve: jest.fn(),
  }),
);
global.IntersectionObserver =
  mockIntersectionObserver as unknown as typeof IntersectionObserver;

// Give elements a non-zero offsetWidth so scale > 0 and the iframe renders
Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
  configurable: true,
  get() {
    return 800;
  },
});

const mockWebsites: IWebsiteProject[] = [
  { url: "https://example.com", name: "Example Site" },
  { url: "https://another.com", name: "Another Site" },
  { url: "https://third.com", name: "Third Site" },
];

describe("WebsiteProjects Component", () => {
  it("should render the section with heading", () => {
    const { container } = render(<WebsiteProjects websites={mockWebsites} />);

    const section = container.querySelector("#website-projects");
    expect(section).toBeTruthy();
    expect(section?.tagName.toLowerCase()).toBe("section");

    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading.textContent).toBe("Website Projects");
  });

  it("should render nav buttons for all websites", async () => {
    await act(async () => {
      render(<WebsiteProjects websites={mockWebsites} />);
    });

    mockWebsites.forEach(({ name }) => {
      expect(
        screen.getByRole("button", { name: `Go to ${name}` }),
      ).toBeTruthy();
    });
  });

  it("should render the first website slide as active", async () => {
    let container!: HTMLElement;
    await act(async () => {
      ({ container } = render(<WebsiteProjects websites={mockWebsites} />));
    });

    const iframe = container.querySelector("iframe");
    expect(iframe).toBeTruthy();
    expect(iframe?.getAttribute("title")).toBe(mockWebsites[0].name);
  });

  it("should render with sticky scroll structure", () => {
    const { container } = render(<WebsiteProjects websites={mockWebsites} />);

    const section = container.querySelector("#website-projects");
    expect(section?.getAttribute("style")).toContain("vh");

    const sticky = container.querySelector(".tw\\:sticky");
    expect(sticky).toBeTruthy();
  });

  it("should render empty state without error", () => {
    render(<WebsiteProjects websites={[]} />);

    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading.textContent).toBe("Website Projects");
  });
});

describe("WebsiteCard Component", () => {
  const mockOpen = jest.fn();

  beforeEach(() => {
    window.open = mockOpen;
  });

  afterEach(() => {
    mockOpen.mockReset();
  });

  it("should render iframe with correct src and title", async () => {
    let container!: HTMLElement;
    await act(async () => {
      ({ container } = render(
        <WebsiteCard url="https://example.com" name="Example Site" />,
      ));
    });

    const iframe = container.querySelector("iframe");
    expect(iframe).toBeTruthy();
    expect(iframe?.getAttribute("src")).toBe("https://example.com");
    expect(iframe?.getAttribute("title")).toBe("Example Site");
  });

  it("should render iframe with pointer-events-none", async () => {
    let container!: HTMLElement;
    await act(async () => {
      ({ container } = render(
        <WebsiteCard url="https://example.com" name="Example Site" />,
      ));
    });

    const iframe = container.querySelector("iframe");
    expect(iframe?.className).toContain("tw:pointer-events-none");
  });

  it("should render scroll animation wrapper with desktop size and random duration", async () => {
    let container!: HTMLElement;
    await act(async () => {
      ({ container } = render(
        <WebsiteCard url="https://example.com" name="Example Site" />,
      ));
    });

    // Scale wrapper: 1920×1080 — find by width style (the inner scale wrapper, not container)
    const allStyledDivs = container.querySelectorAll("div[style]");
    const wrapper = Array.from(allStyledDivs).find(
      (el) => (el as HTMLElement).style.width === "1920px",
    ) as HTMLElement;
    expect(wrapper).toBeTruthy();
    expect(wrapper.style.width).toBe("1920px");
    expect(wrapper.style.height).toBe("1080px");

    // Iframe: unique per-card animation name with wzp- prefix
    const iframe = container.querySelector("iframe") as HTMLIFrameElement;
    expect(iframe.style.animation).toContain("wzp-");
    expect(iframe.style.width).toBe("1920px");
    expect(iframe.style.height).toBe("1080px");

    // Style tag with keyframes should be present
    const styleTag = container.querySelector("style");
    expect(styleTag?.textContent).toContain("wzp-");
  });

  it("should render overlay link with accessible label", () => {
    render(<WebsiteCard url="https://example.com" name="Example Site" />);

    const overlay = screen.getByRole("link", { name: "Visit Example Site" });
    expect(overlay).toBeTruthy();
  });

  it("should open website in new tab when overlay is clicked", () => {
    render(<WebsiteCard url="https://example.com" name="Example Site" />);

    const overlay = screen.getByRole("link", { name: "Visit Example Site" });
    fireEvent.click(overlay);

    expect(mockOpen).toHaveBeenCalledWith(
      "https://example.com",
      "_blank",
      "noopener,noreferrer",
    );
  });

  it("should open website in new tab on Enter key press", () => {
    render(<WebsiteCard url="https://example.com" name="Example Site" />);

    const overlay = screen.getByRole("link", { name: "Visit Example Site" });
    fireEvent.keyDown(overlay, { key: "Enter" });

    expect(mockOpen).toHaveBeenCalledWith(
      "https://example.com",
      "_blank",
      "noopener,noreferrer",
    );
  });

  it("should open website in new tab on Space key press", () => {
    render(<WebsiteCard url="https://example.com" name="Example Site" />);

    const overlay = screen.getByRole("link", { name: "Visit Example Site" });
    fireEvent.keyDown(overlay, { key: " " });

    expect(mockOpen).toHaveBeenCalledWith(
      "https://example.com",
      "_blank",
      "noopener,noreferrer",
    );
  });

  it("should display the website name in the label", () => {
    render(<WebsiteCard url="https://example.com" name="My Portfolio" />);

    const nameLabel = screen.getByText("My Portfolio");
    expect(nameLabel).toBeTruthy();
  });

  it("should apply hover shadow on mouseenter and reset on mouseleave", () => {
    const { container } = render(
      <WebsiteCard url="https://example.com" name="Example Site" />,
    );

    const card = container.firstChild as HTMLElement;
    expect(card).toBeTruthy();

    fireEvent.mouseEnter(card);
    expect(card.style.boxShadow).toBe("var(--card-shadow-hover)");
    expect(card.style.transform).toBe("translateY(-3px)");

    fireEvent.mouseLeave(card);
    expect(card.style.boxShadow).toBe("var(--card-shadow)");
    expect(card.style.transform).toBe("translateY(0)");
  });
});
