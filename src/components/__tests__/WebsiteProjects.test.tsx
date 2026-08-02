import { render, screen, fireEvent, act } from "@testing-library/react";
import WebsiteProjects from "../organisms/WebsiteProjects";
import WebsiteCard from "../atoms/WebsiteCard";
import WebsiteSlide from "../atoms/WebsiteSlide";
import { IWebsiteProject } from "@/interfaces/website-projects";

// Mock ResizeObserver — triggers callback immediately on observe
const mockResizeObserver = jest.fn((callback: ResizeObserverCallback) => ({
  observe: jest.fn(() => callback([], {} as ResizeObserver)),
  disconnect: jest.fn(),
  unobserve: jest.fn(),
}));
global.ResizeObserver = mockResizeObserver as unknown as typeof ResizeObserver;

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
  it("should render the section with heading", async () => {
    let container!: HTMLElement;
    await act(async () => {
      ({ container } = render(<WebsiteProjects websites={mockWebsites} />));
    });

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

  it("should render with sticky scroll structure", async () => {
    let container!: HTMLElement;
    await act(async () => {
      ({ container } = render(<WebsiteProjects websites={mockWebsites} />));
    });

    const section = container.querySelector("#website-projects");
    expect(section?.getAttribute("style")).toContain("vh");

    const sticky = container.querySelector(".tw\\:sticky");
    expect(sticky).toBeTruthy();
  });

  it("should render empty state without error", async () => {
    await act(async () => {
      render(<WebsiteProjects websites={[]} />);
    });

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

  it("should render overlay link with accessible label", async () => {
    await act(async () => {
      render(<WebsiteCard url="https://example.com" name="Example Site" />);
    });

    const overlay = screen.getByRole("link", { name: "Visit Example Site" });
    expect(overlay).toBeTruthy();
  });

  it("should open website in new tab when overlay is clicked", async () => {
    await act(async () => {
      render(<WebsiteCard url="https://example.com" name="Example Site" />);
    });

    const overlay = screen.getByRole("link", { name: "Visit Example Site" });
    fireEvent.click(overlay);

    expect(mockOpen).toHaveBeenCalledWith(
      "https://example.com",
      "_blank",
      "noopener,noreferrer",
    );
  });

  it("should open website in new tab on Enter key press", async () => {
    await act(async () => {
      render(<WebsiteCard url="https://example.com" name="Example Site" />);
    });

    const overlay = screen.getByRole("link", { name: "Visit Example Site" });
    fireEvent.keyDown(overlay, { key: "Enter" });

    expect(mockOpen).toHaveBeenCalledWith(
      "https://example.com",
      "_blank",
      "noopener,noreferrer",
    );
  });

  it("should open website in new tab on Space key press", async () => {
    await act(async () => {
      render(<WebsiteCard url="https://example.com" name="Example Site" />);
    });

    const overlay = screen.getByRole("link", { name: "Visit Example Site" });
    fireEvent.keyDown(overlay, { key: " " });

    expect(mockOpen).toHaveBeenCalledWith(
      "https://example.com",
      "_blank",
      "noopener,noreferrer",
    );
  });

  it("should not open website for unrelated key press", async () => {
    await act(async () => {
      render(<WebsiteCard url="https://example.com" name="Example Site" />);
    });

    const overlay = screen.getByRole("link", { name: "Visit Example Site" });
    fireEvent.keyDown(overlay, { key: "Escape" });

    expect(mockOpen).not.toHaveBeenCalled();
  });

  it("should display the website name in the label", async () => {
    await act(async () => {
      render(<WebsiteCard url="https://example.com" name="My Portfolio" />);
    });

    const nameLabel = screen.getByText("My Portfolio");
    expect(nameLabel).toBeTruthy();
  });

  it("should apply hover shadow on mouseenter and reset on mouseleave", async () => {
    let container!: HTMLElement;
    await act(async () => {
      ({ container } = render(
        <WebsiteCard url="https://example.com" name="Example Site" />,
      ));
    });

    const card = container.firstChild as HTMLElement;
    expect(card).toBeTruthy();

    fireEvent.mouseEnter(card);
    expect(card.style.boxShadow).toBe("var(--card-shadow-hover)");
    expect(card.style.transform).toBe("translateY(-3px)");

    fireEvent.mouseLeave(card);
    expect(card.style.boxShadow).toBe("var(--card-shadow)");
    expect(card.style.transform).toBe("translateY(0)");
  });

  it("should not reveal the iframe when the observer reports no intersection", async () => {
    const originalIO = global.IntersectionObserver;
    global.IntersectionObserver = jest.fn((_callback: IntersectionObserverCallback) => ({
      observe: jest.fn((el: Element) => {
        _callback(
          [{ isIntersecting: false, target: el } as IntersectionObserverEntry],
          {} as IntersectionObserver,
        );
      }),
      disconnect: jest.fn(),
      unobserve: jest.fn(),
    })) as unknown as typeof IntersectionObserver;

    let container!: HTMLElement;
    await act(async () => {
      ({ container } = render(
        <WebsiteCard url="https://example.com" name="Example Site" />,
      ));
    });

    expect(container.querySelector("iframe")).toBeNull();

    global.IntersectionObserver = originalIO;
  });
});

describe("WebsiteSlide Component", () => {
  it("should render iframe when shouldLoad and ready", async () => {
    let container!: HTMLElement;
    await act(async () => {
      ({ container } = render(
        <WebsiteSlide
          url="https://example.com"
          name="Example"
          isActive={true}
          shouldLoad={true}
          index={0}
          total={3}
        />,
      ));
    });

    const iframe = container.querySelector("iframe");
    expect(iframe?.getAttribute("src")).toBe("https://example.com");
    expect(iframe?.getAttribute("title")).toBe("Example");
  });

  it("should not render iframe when shouldLoad is false", async () => {
    let container!: HTMLElement;
    await act(async () => {
      ({ container } = render(
        <WebsiteSlide
          url="https://example.com"
          name="Example"
          isActive={false}
          shouldLoad={false}
          index={0}
          total={3}
        />,
      ));
    });

    expect(container.querySelector("iframe")).toBeNull();
  });

  it("should render site name and counter", async () => {
    await act(async () => {
      render(
        <WebsiteSlide
          url="https://example.com"
          name="My Portfolio"
          isActive={true}
          shouldLoad={false}
          index={1}
          total={3}
        />,
      );
    });

    expect(screen.getByText("My Portfolio")).toBeTruthy();
  });

  it("should apply hover effects on Visit Site link", async () => {
    await act(async () => {
      render(
        <WebsiteSlide
          url="https://example.com"
          name="Example"
          isActive={true}
          shouldLoad={true}
          index={0}
          total={3}
        />,
      );
    });

    const visitLink = screen.getByRole("link", { name: "Visit Example" });

    fireEvent.mouseEnter(visitLink);
    expect((visitLink as HTMLAnchorElement).style.filter).toBe(
      "brightness(1.15)",
    );
    expect((visitLink as HTMLAnchorElement).style.transform).toBe(
      "scale(1.04)",
    );

    fireEvent.mouseLeave(visitLink);
    expect((visitLink as HTMLAnchorElement).style.filter).toBe("brightness(1)");
    expect((visitLink as HTMLAnchorElement).style.transform).toBe("scale(1)");
  });
});

describe("WebsiteProjects scroll and navigation", () => {
  beforeEach(() => {
    window.scrollTo = jest.fn() as unknown as typeof window.scrollTo;
  });

  it("should update active index on scroll", async () => {
    Object.defineProperty(window, "innerHeight", {
      configurable: true,
      value: 500,
    });

    let container!: HTMLElement;
    await act(async () => {
      ({ container } = render(<WebsiteProjects websites={mockWebsites} />));
    });

    const section = container.querySelector("#website-projects") as HTMLElement;

    Object.defineProperty(section, "offsetHeight", {
      configurable: true,
      get: () => 3000,
    });
    jest.spyOn(section, "getBoundingClientRect").mockReturnValue({
      top: -1500,
      bottom: 1500,
      left: 0,
      right: 800,
      width: 800,
      height: 3000,
      x: 0,
      y: -1500,
      toJSON: () => ({}),
    } as DOMRect);

    await act(async () => {
      fireEvent.scroll(window);
    });

    expect(container.querySelector("#website-projects")).toBeTruthy();
  });

  it("should not queue a next slide when scroll reaches the last slide", async () => {
    Object.defineProperty(window, "innerHeight", {
      configurable: true,
      value: 500,
    });

    let container!: HTMLElement;
    await act(async () => {
      ({ container } = render(<WebsiteProjects websites={mockWebsites} />));
    });

    const section = container.querySelector("#website-projects") as HTMLElement;

    Object.defineProperty(section, "offsetHeight", {
      configurable: true,
      get: () => 3000,
    });
    // scrolled (2500) === totalScrollable (3000 - 500), so progress clamps to
    // 1 and index resolves to the last slide (websites.length - 1).
    jest.spyOn(section, "getBoundingClientRect").mockReturnValue({
      top: -2500,
      bottom: 500,
      left: 0,
      right: 800,
      width: 800,
      height: 3000,
      x: 0,
      y: -2500,
      toJSON: () => ({}),
    } as DOMRect);

    await act(async () => {
      fireEvent.scroll(window);
    });

    const lastNavButton = screen.getByRole("button", {
      name: `Go to ${mockWebsites[mockWebsites.length - 1].name}`,
    });
    expect(lastNavButton.style.width).toBe("8px");
  });

  it("should call window.scrollTo when nav button is clicked", async () => {
    let container!: HTMLElement;
    await act(async () => {
      ({ container } = render(<WebsiteProjects websites={mockWebsites} />));
    });

    const section = container.querySelector("#website-projects") as HTMLElement;
    jest.spyOn(section, "getBoundingClientRect").mockReturnValue({
      top: 0,
      bottom: 3000,
      left: 0,
      right: 800,
      width: 800,
      height: 3000,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    } as DOMRect);

    const secondButton = screen.getByRole("button", {
      name: `Go to ${mockWebsites[1].name}`,
    });

    await act(async () => {
      fireEvent.click(secondButton);
    });

    expect(window.scrollTo).toHaveBeenCalled();
  });
});
