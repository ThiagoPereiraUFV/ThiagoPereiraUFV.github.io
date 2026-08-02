jest.mock("next/og", () => ({
  ImageResponse: jest.fn().mockImplementation(function () {
    return { type: "ImageResponse" };
  }),
}));

import TwitterImage, {
  alt,
  size,
  contentType,
  dynamic,
} from "../twitter-image";
import { ImageResponse } from "next/og";
import { userData } from "@/helpers/userdata";

describe("TwitterImage", () => {
  it("should export force-static dynamic config", () => {
    expect(dynamic).toBe("force-static");
  });

  it("should export correct size", () => {
    expect(size).toEqual({ width: 1200, height: 600 });
  });

  it("should export correct contentType", () => {
    expect(contentType).toBe("image/png");
  });

  it("should export correct alt text", () => {
    expect(alt).toContain(userData.profileName);
  });

  it("should return an ImageResponse", () => {
    const result = TwitterImage();
    expect(ImageResponse).toHaveBeenCalled();
    expect(result).toBeTruthy();
  });

  it("should pass size options to ImageResponse", () => {
    TwitterImage();
    const calls = (ImageResponse as unknown as jest.Mock).mock.calls;
    const lastCall = calls[calls.length - 1];
    expect(lastCall[1]).toEqual({ width: 1200, height: 600 });
  });
});
