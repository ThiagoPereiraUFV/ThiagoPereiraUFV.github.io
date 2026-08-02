import React from "react";
import { screen } from "@testing-library/react";
import { mockFetch, customRender } from "../testUtils";

describe("mockFetch", () => {
  it("should resolve json with the given response data", async () => {
    const response = await mockFetch({ hello: "world" })();
    expect(response.ok).toBe(true);
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ hello: "world" });
  });

  it("should default status/ok when overridden", async () => {
    const response = await mockFetch({ error: "oops" }, 404, false)();
    expect(response.ok).toBe(false);
    expect(response.status).toBe(404);
  });

  it("should return the raw string from text() when responseData is a string", async () => {
    const response = await mockFetch("plain text body")();
    await expect(response.text()).resolves.toBe("plain text body");
  });

  it("should JSON-stringify non-string responseData in text()", async () => {
    const response = await mockFetch({ hello: "world" })();
    await expect(response.text()).resolves.toBe(
      JSON.stringify({ hello: "world" }),
    );
  });
});

describe("customRender", () => {
  it("should render a React element like the default testing-library render", () => {
    customRender(React.createElement("div", null, "Hello"));
    expect(screen.getByText("Hello")).toBeTruthy();
  });
});
