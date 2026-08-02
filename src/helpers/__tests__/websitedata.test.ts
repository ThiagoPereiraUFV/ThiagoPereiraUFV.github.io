import { filterIframeAllowed, websiteProjects } from "../websitedata";
import { IWebsiteProject } from "@/interfaces/website-projects";

const mockSites: IWebsiteProject[] = [
	{ url: "https://allowed.com", name: "Allowed" },
	{ url: "https://denied.com", name: "Denied (X-Frame-Options: DENY)" },
	{ url: "https://sameorigin.com", name: "Denied (X-Frame-Options: SAMEORIGIN)" },
	{ url: "https://csp-none.com", name: "Denied (CSP frame-ancestors none)" },
	{ url: "https://csp-self.com", name: "Denied (CSP frame-ancestors self)" },
	{ url: "https://csp-wildcard.com", name: "Allowed (CSP frame-ancestors *)" },
	{ url: "https://timeout.com", name: "Timeout (excluded)" },
];

function makeFetchMock(
	headers: Record<string, string>,
	shouldThrow = false
): () => Promise<Response> {
	return () => {
		if (shouldThrow) return Promise.reject(new Error("Timeout"));
		return Promise.resolve({
			headers: {
				get: (name: string) => headers[name.toLowerCase()] ?? null,
			},
		} as unknown as Response);
	};
}

describe("websiteProjects", () => {
	it("exports a non-empty list of website projects", () => {
		expect(Array.isArray(websiteProjects)).toBe(true);
		expect(websiteProjects.length).toBeGreaterThan(0);
		websiteProjects.forEach((site) => {
			expect(typeof site.url).toBe("string");
			expect(typeof site.name).toBe("string");
		});
	});
});

describe("filterIframeAllowed", () => {
	beforeEach(() => {
		(global as Record<string, unknown>).fetch = jest.fn(
			(url: RequestInfo | URL) => {
				const urlStr = url.toString();
				if (urlStr.includes("allowed.com")) return makeFetchMock({})();
				if (urlStr.includes("denied.com"))
					return makeFetchMock({ "x-frame-options": "DENY" })();
				if (urlStr.includes("sameorigin.com"))
					return makeFetchMock({ "x-frame-options": "SAMEORIGIN" })();
				if (urlStr.includes("csp-none.com"))
					return makeFetchMock({
						"content-security-policy": "default-src 'self'; frame-ancestors 'none'",
					})();
				if (urlStr.includes("csp-self.com"))
					return makeFetchMock({
						"content-security-policy": "frame-ancestors 'self'",
					})();
				if (urlStr.includes("csp-wildcard.com"))
					return makeFetchMock({
						"content-security-policy": "frame-ancestors *",
					})();
				if (urlStr.includes("timeout.com")) return makeFetchMock({}, true)();
				return makeFetchMock({})();
			}
		);
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it("returns only sites that allow iframe embedding", async () => {
		const result = await filterIframeAllowed(mockSites);
		const names = result.map((s) => s.name);
		expect(names).toContain("Allowed");
		expect(names).toContain("Allowed (CSP frame-ancestors *)");
		expect(names).not.toContain("Denied (X-Frame-Options: DENY)");
		expect(names).not.toContain("Denied (X-Frame-Options: SAMEORIGIN)");
		expect(names).not.toContain("Denied (CSP frame-ancestors none)");
		expect(names).not.toContain("Denied (CSP frame-ancestors self)");
		expect(names).not.toContain("Timeout (excluded)");
	});

	it("excludes sites with X-Frame-Options: DENY (case-insensitive)", async () => {
		(global as Record<string, unknown>).fetch = jest.fn().mockResolvedValue({
			headers: { get: (h: string) => (h.toLowerCase() === "x-frame-options" ? "deny" : null) },
		} as unknown as Response);
		const result = await filterIframeAllowed([{ url: "https://x.com", name: "X" }]);
		expect(result).toHaveLength(0);
	});

	it("excludes sites with X-Frame-Options: SAMEORIGIN (case-insensitive)", async () => {
		(global as Record<string, unknown>).fetch = jest.fn().mockResolvedValue({
			headers: { get: (h: string) => (h.toLowerCase() === "x-frame-options" ? "sameorigin" : null) },
		} as unknown as Response);
		const result = await filterIframeAllowed([{ url: "https://x.com", name: "X" }]);
		expect(result).toHaveLength(0);
	});

	it("includes sites with no restrictive headers", async () => {
		(global as Record<string, unknown>).fetch = jest.fn().mockResolvedValue({
			headers: { get: () => null },
		} as unknown as Response);
		const result = await filterIframeAllowed([{ url: "https://x.com", name: "X" }]);
		expect(result).toHaveLength(1);
	});

	it("excludes sites that throw (network error or timeout)", async () => {
		(global as Record<string, unknown>).fetch = jest
			.fn()
			.mockRejectedValue(new Error("Network error"));
		const result = await filterIframeAllowed([{ url: "https://x.com", name: "X" }]);
		expect(result).toHaveLength(0);
	});

	it("returns an empty array when given an empty list", async () => {
		const result = await filterIframeAllowed([]);
		expect(result).toHaveLength(0);
	});

	it("allows CSP with multiple non-self/none frame-ancestors tokens", async () => {
		(global as Record<string, unknown>).fetch = jest.fn().mockResolvedValue({
			headers: {
				get: (h: string) =>
					h.toLowerCase() === "content-security-policy"
						? "frame-ancestors https://embed.example.com"
						: null,
			},
		} as unknown as Response);
		const result = await filterIframeAllowed([{ url: "https://x.com", name: "X" }]);
		expect(result).toHaveLength(1);
	});

	it("includes sites with a CSP header that has no frame-ancestors directive", async () => {
		(global as Record<string, unknown>).fetch = jest.fn().mockResolvedValue({
			headers: {
				get: (h: string) =>
					h.toLowerCase() === "content-security-policy"
						? "default-src 'self'"
						: null,
			},
		} as unknown as Response);
		const result = await filterIframeAllowed([{ url: "https://x.com", name: "X" }]);
		expect(result).toHaveLength(1);
	});

	it("uses HEAD method for all requests", async () => {
		const fetchMock = jest.fn().mockResolvedValue({
			headers: { get: () => null },
		} as unknown as Response);
		(global as Record<string, unknown>).fetch = fetchMock;
		await filterIframeAllowed([{ url: "https://x.com", name: "X" }]);
		expect(fetchMock).toHaveBeenCalledWith(
			"https://x.com",
			expect.objectContaining({ method: "HEAD" })
		);
	});
});
