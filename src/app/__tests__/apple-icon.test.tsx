jest.mock("next/og", () => ({
  ImageResponse: jest.fn().mockImplementation(function () {
    return { type: "ImageResponse" };
  }),
}));

import AppleIcon, { size, contentType } from "../apple-icon";
import { ImageResponse } from "next/og";

describe("AppleIcon (apple touch icon)", () => {
  it("should export correct size", () => {
    expect(size).toEqual({ width: 180, height: 180 });
  });

  it("should export correct contentType", () => {
    expect(contentType).toBe("image/png");
  });

  it("should return an ImageResponse", () => {
    const result = AppleIcon();
    expect(ImageResponse).toHaveBeenCalled();
    expect(result).toBeTruthy();
  });

  it("should pass size options to ImageResponse", () => {
    AppleIcon();
    const calls = (ImageResponse as unknown as jest.Mock).mock.calls;
    const lastCall = calls[calls.length - 1];
    expect(lastCall[1]).toEqual({ width: 180, height: 180 });
  });
});
