jest.mock("next/og", () => ({
  ImageResponse: jest.fn().mockImplementation(function () {
    return { type: "ImageResponse" };
  }),
}));

import OpenGraphImage, { alt, size, contentType } from "../opengraph-image";
import { ImageResponse } from "next/og";
import { userData } from "@/helpers/userdata";

describe("OpenGraphImage", () => {
  it("should export correct size", () => {
    expect(size).toEqual({ width: 1200, height: 630 });
  });

  it("should export correct contentType", () => {
    expect(contentType).toBe("image/png");
  });

  it("should export correct alt text", () => {
    expect(alt).toContain(userData.profileName);
  });

  it("should return an ImageResponse", () => {
    const result = OpenGraphImage();
    expect(ImageResponse).toHaveBeenCalled();
    expect(result).toBeTruthy();
  });

  it("should pass size options to ImageResponse", () => {
    OpenGraphImage();
    const calls = (ImageResponse as unknown as jest.Mock).mock.calls;
    const lastCall = calls[calls.length - 1];
    expect(lastCall[1]).toEqual({ width: 1200, height: 630 });
  });
});
