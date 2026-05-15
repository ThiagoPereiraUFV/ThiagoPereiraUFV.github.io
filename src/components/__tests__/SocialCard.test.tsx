import { render, screen } from "@testing-library/react";
import SocialCard from "../atoms/SocialCard";
import { userData } from "@/helpers/userdata";

const defaultProps = {
  width: 1200,
  height: 630,
  padding: "64px 72px",
  badge: { size: 100, borderRadius: 24, fontSize: 42, marginBottom: 32 },
  name: { fontSize: 64, marginBottom: 16 },
  role: { fontSize: 30, marginBottom: 40 },
  footer: { dividerWidth: 40, fontSize: 22 },
};

describe("SocialCard", () => {
  it("should render the profile name", () => {
    render(<SocialCard {...defaultProps} />);
    expect(screen.getByText(userData.profileName)).toBeTruthy();
  });

  it("should render the TP initials badge", () => {
    render(<SocialCard {...defaultProps} />);
    expect(screen.getByText("TP")).toBeTruthy();
  });

  it("should render the role", () => {
    render(<SocialCard {...defaultProps} />);
    expect(screen.getByText("Full Stack Software Engineer")).toBeTruthy();
  });

  it("should render the site URL", () => {
    render(<SocialCard {...defaultProps} />);
    expect(
      screen.getByText(userData.siteUrl.replace("https://", "")),
    ).toBeTruthy();
  });

  it("should apply the correct container dimensions", () => {
    const { container } = render(<SocialCard {...defaultProps} />);
    const root = container.firstChild as HTMLElement;
    expect(root.style.width).toBe("1200px");
    expect(root.style.height).toBe("630px");
  });

  it("should apply the correct padding", () => {
    const { container } = render(<SocialCard {...defaultProps} />);
    const root = container.firstChild as HTMLElement;
    expect(root.style.padding).toBe("64px 72px");
  });
});
