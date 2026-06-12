import { IData } from "@/interfaces";
import { getGithubData, getGithubRawFile, getLowCodeProjects } from "@/lib/actions";
import { websiteProjects, filterIframeAllowed } from "@/helpers/websitedata";

export async function buildPageData(
	username: string,
	profileName: string
): Promise<IData> {
	const [githubDataResult, aboutUserDataResult, lowCodeProjectsResult, filteredWebsitesResult] = await Promise.allSettled([
		getGithubData(username),
		getGithubRawFile({
			owner: username,
			repo: username,
			branch: "main",
			filepath: "README.md",
		}),
		getLowCodeProjects(),
		filterIframeAllowed(websiteProjects),
	]);

	const githubData =
		githubDataResult.status === "fulfilled"
			? githubDataResult.value
			: { error: "Failed to fetch GitHub data" };
	const aboutUserData =
		aboutUserDataResult.status === "fulfilled"
			? aboutUserDataResult.value
			: { error: "Failed to fetch about user data" };
	const lowCodeProjects =
		lowCodeProjectsResult.status === "fulfilled"
			? lowCodeProjectsResult.value
			: [];
	const filteredWebsites =
		filteredWebsitesResult.status === "fulfilled"
			? filteredWebsitesResult.value
			: [];

	const data = {
		header: {
			title: profileName,
			sections: [],
		},
		about: {
			aboutUserData: typeof aboutUserData === "string" ? aboutUserData : "",
		},
		projects: {
			websiteProjects: filteredWebsites,
			repos: [],
			lowCodeProjects: [],
		},
	} as IData;

	if (typeof aboutUserData === "string") {
		data.header.sections.push("About");
	}

	if (filteredWebsites.length > 0) {
		data.header.sections.push("Website Projects");
	}

	if (!("error" in githubData)) {
		data.header.sections.push("Projects");
		data.projects.repos = githubData.repos ?? [];
	}

	if (!("error" in lowCodeProjects)) {
		data.header.sections.push("Low-code Projects");
		data.projects.lowCodeProjects = lowCodeProjects;
	}

	data.header.sections.push("Contact");

	return data;
}
