import { buildPageData } from "../pageData";
import { getGithubData, getGithubRawFile, getLowCodeProjects } from "@/lib/actions";
import { filterIframeAllowed, websiteProjects } from "@/helpers/websitedata";
import { mockLowCodeProject } from "@/testUtils";

jest.mock("@/lib/actions");
jest.mock("@/helpers/websitedata", () => ({
	websiteProjects: [{ url: "https://example.com", name: "Example" }],
	filterIframeAllowed: jest.fn(),
}));

const mockGetGithubData = getGithubData as jest.Mock;
const mockGetGithubRawFile = getGithubRawFile as jest.Mock;
const mockGetLowCodeProjects = getLowCodeProjects as jest.Mock;
const mockFilterIframeAllowed = filterIframeAllowed as jest.Mock;

const mockRepo = { id: 1, name: "repo1" };

describe("buildPageData", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("should include all sections when every data source succeeds", async () => {
		mockGetGithubData.mockResolvedValue({ repos: [mockRepo] });
		mockGetGithubRawFile.mockResolvedValue("# About Me");
		mockGetLowCodeProjects.mockResolvedValue([mockLowCodeProject]);
		mockFilterIframeAllowed.mockResolvedValue(websiteProjects);

		const data = await buildPageData("user", "User Name");

		expect(data.header.sections).toEqual([
			"About",
			"Website Projects",
			"Projects",
			"Low-code Projects",
			"Contact",
		]);
		expect(data.about.aboutUserData).toBe("# About Me");
		expect(data.projects.repos).toEqual([mockRepo]);
		expect(data.projects.lowCodeProjects).toEqual([mockLowCodeProject]);
		expect(data.projects.websiteProjects).toEqual(websiteProjects);
	});

	it("should omit the Projects section when the github data promise rejects", async () => {
		mockGetGithubData.mockRejectedValue(new Error("network error"));
		mockGetGithubRawFile.mockResolvedValue("# About Me");
		mockGetLowCodeProjects.mockResolvedValue([]);
		mockFilterIframeAllowed.mockResolvedValue([]);

		const data = await buildPageData("user", "User Name");

		expect(data.header.sections).not.toContain("Projects");
		expect(data.projects.repos).toEqual([]);
	});

	it("should omit the Projects section when github data resolves with an error", async () => {
		mockGetGithubData.mockResolvedValue({ error: "rate limited" });
		mockGetGithubRawFile.mockResolvedValue("# About Me");
		mockGetLowCodeProjects.mockResolvedValue([]);
		mockFilterIframeAllowed.mockResolvedValue([]);

		const data = await buildPageData("user", "User Name");

		expect(data.header.sections).not.toContain("Projects");
		expect(data.projects.repos).toEqual([]);
	});

	it("should omit the About section when the readme promise rejects", async () => {
		mockGetGithubData.mockResolvedValue({ repos: [] });
		mockGetGithubRawFile.mockRejectedValue(new Error("not found"));
		mockGetLowCodeProjects.mockResolvedValue([]);
		mockFilterIframeAllowed.mockResolvedValue([]);

		const data = await buildPageData("user", "User Name");

		expect(data.header.sections).not.toContain("About");
		expect(data.about.aboutUserData).toBe("");
	});

	it("should omit the About section when the readme resolves with an error object", async () => {
		mockGetGithubData.mockResolvedValue({ repos: [] });
		mockGetGithubRawFile.mockResolvedValue({ error: "not found" });
		mockGetLowCodeProjects.mockResolvedValue([]);
		mockFilterIframeAllowed.mockResolvedValue([]);

		const data = await buildPageData("user", "User Name");

		expect(data.header.sections).not.toContain("About");
		expect(data.about.aboutUserData).toBe("");
	});

	it("should still add the Low-code Projects section with an empty list when that promise rejects", async () => {
		mockGetGithubData.mockResolvedValue({ repos: [] });
		mockGetGithubRawFile.mockResolvedValue("# About Me");
		mockGetLowCodeProjects.mockRejectedValue(new Error("service down"));
		mockFilterIframeAllowed.mockResolvedValue([]);

		const data = await buildPageData("user", "User Name");

		expect(data.header.sections).toContain("Low-code Projects");
		expect(data.projects.lowCodeProjects).toEqual([]);
	});

	it("should omit the Low-code Projects section when it resolves with an error object", async () => {
		mockGetGithubData.mockResolvedValue({ repos: [] });
		mockGetGithubRawFile.mockResolvedValue("# About Me");
		mockGetLowCodeProjects.mockResolvedValue({ error: "service down" });
		mockFilterIframeAllowed.mockResolvedValue([]);

		const data = await buildPageData("user", "User Name");

		expect(data.header.sections).not.toContain("Low-code Projects");
	});

	it("should omit the Website Projects section when filtering rejects", async () => {
		mockGetGithubData.mockResolvedValue({ repos: [] });
		mockGetGithubRawFile.mockResolvedValue("# About Me");
		mockGetLowCodeProjects.mockResolvedValue([]);
		mockFilterIframeAllowed.mockRejectedValue(new Error("timeout"));

		const data = await buildPageData("user", "User Name");

		expect(data.header.sections).not.toContain("Website Projects");
		expect(data.projects.websiteProjects).toEqual([]);
	});

	it("should omit the Website Projects section when filtering resolves with no sites", async () => {
		mockGetGithubData.mockResolvedValue({ repos: [] });
		mockGetGithubRawFile.mockResolvedValue("# About Me");
		mockGetLowCodeProjects.mockResolvedValue([]);
		mockFilterIframeAllowed.mockResolvedValue([]);

		const data = await buildPageData("user", "User Name");

		expect(data.header.sections).not.toContain("Website Projects");
	});

	it("should always include the Contact section and the given profile name as title", async () => {
		mockGetGithubData.mockResolvedValue({ error: "rate limited" });
		mockGetGithubRawFile.mockResolvedValue({ error: "not found" });
		mockGetLowCodeProjects.mockResolvedValue({ error: "down" });
		mockFilterIframeAllowed.mockResolvedValue([]);

		const data = await buildPageData("user", "User Name");

		expect(data.header.sections).toEqual(["Contact"]);
		expect(data.header.title).toBe("User Name");
	});

	it("should default repos to an empty array when github data has none", async () => {
		mockGetGithubData.mockResolvedValue({});
		mockGetGithubRawFile.mockResolvedValue("# About Me");
		mockGetLowCodeProjects.mockResolvedValue([]);
		mockFilterIframeAllowed.mockResolvedValue([]);

		const data = await buildPageData("user", "User Name");

		expect(data.header.sections).toContain("Projects");
		expect(data.projects.repos).toEqual([]);
	});
});
