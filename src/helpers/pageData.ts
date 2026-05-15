import { IData } from "@/interfaces";
import { getGithubData, getGithubRawFile } from "@/lib/actions";

export async function buildPageData(
	username: string,
	profileName: string
): Promise<IData> {
	const [githubDataResult, aboutUserDataResult] = await Promise.allSettled([
		getGithubData(username),
		getGithubRawFile({
			owner: username,
			repo: username,
			branch: "main",
			filepath: "README.md",
		}),
	]);

	const githubData =
		githubDataResult.status === "fulfilled"
			? githubDataResult.value
			: { error: "Failed to fetch GitHub data" };
	const aboutUserData =
		aboutUserDataResult.status === "fulfilled"
			? aboutUserDataResult.value
			: { error: "Failed to fetch about user data" };

	const data = {
		header: {
			title: profileName,
			sections: [],
		},
		about: {
			aboutUserData: typeof aboutUserData === "string" ? aboutUserData : "",
		},
		projects: {
			repos: [],
		},
	} as IData;

	if (typeof aboutUserData === "string") {
		data.header.sections.push("About");
	}

	data.header.sections.push("Website Projects");

	if (!("error" in githubData)) {
		data.header.sections.push("Projects");
		data.projects.repos = githubData.repos ?? [];
	}

	data.header.sections.push("Contact");

	return data;
}
