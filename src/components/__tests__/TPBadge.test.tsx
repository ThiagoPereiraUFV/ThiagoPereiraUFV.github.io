import { render, screen } from "@testing-library/react";
import TPBadge from "../atoms/TPBadge";

describe("TPBadge", () => {
  it("should render TP initials", () => {
    render(<TPBadge size={32} borderRadius={7} fontSize={20} />);
    expect(screen.getByText("TP")).toBeTruthy();
  });

  it("should apply solid gradient background by default", () => {
    const { container } = render(
      <TPBadge size={32} borderRadius={7} fontSize={20} />,
    );
    const root = container.firstChild as HTMLElement;
    expect(root.style.background).toContain("linear-gradient");
  });

  it("should apply glass background when variant is glass", () => {
    const { container } = render(
      <TPBadge size={32} borderRadius={7} fontSize={20} variant="glass" />,
    );
    const root = container.firstChild as HTMLElement;
    expect(root.style.background).toContain("rgba");
  });

  it("should apply border when variant is glass", () => {
    const { container } = render(
      <TPBadge size={32} borderRadius={7} fontSize={20} variant="glass" />,
    );
    const root = container.firstChild as HTMLElement;
    expect(root.style.border).toContain("rgba(255, 255, 255, 0.25)");
  });

  it("should not apply border when variant is solid", () => {
    const { container } = render(
      <TPBadge size={32} borderRadius={7} fontSize={20} variant="solid" />,
    );
    const root = container.firstChild as HTMLElement;
    expect(root.style.border).toBe("");
  });

  it("should apply correct dimensions", () => {
    const { container } = render(
      <TPBadge size={100} borderRadius={24} fontSize={42} />,
    );
    const root = container.firstChild as HTMLElement;
    expect(root.style.width).toBe("100px");
    expect(root.style.height).toBe("100px");
    expect(root.style.borderRadius).toBe("24px");
  });

  it("should apply custom letterSpacing", () => {
    render(
      <TPBadge size={32} borderRadius={7} fontSize={20} letterSpacing={-0.5} />,
    );
    expect(screen.getByText("TP")).toBeTruthy();
  });
});
