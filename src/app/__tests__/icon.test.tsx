jest.mock("next/og", () => ({
  ImageResponse: jest.fn().mockImplementation(function () {
    return { type: "ImageResponse" };
  }),
}));

import Icon, { size, contentType } from "../icon";
import { ImageResponse } from "next/og";

describe("Icon (favicon)", () => {
  it("should export correct size", () => {
    expect(size).toEqual({ width: 32, height: 32 });
  });

  it("should export correct contentType", () => {
    expect(contentType).toBe("image/png");
  });

  it("should return an ImageResponse", () => {
    const result = Icon();
    expect(ImageResponse).toHaveBeenCalled();
    expect(result).toBeTruthy();
  });

  it("should pass size options to ImageResponse", () => {
    Icon();
    const calls = (ImageResponse as unknown as jest.Mock).mock.calls;
    const lastCall = calls[calls.length - 1];
    expect(lastCall[1]).toEqual({ width: 32, height: 32 });
  });
});
