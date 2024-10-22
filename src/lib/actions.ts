'use server';

import { IGetGithubRawFileProps } from "@/interfaces/actions";
import { IGithubUserData, IGithubUserRepo } from "@/interfaces/github";

export async function getGithubData(username: string) {
	try {
		if (!username) {
			return {
				error: {
					message: "Username is required",
					status: 400
				}
			} as const;
		}

		const [userData, userRepos] = await Promise.all([
			getGithubUserData(username),
			getGithubUserRepos(username)
		]);

		if ("error" in userData) {
			return userData;
		}

		if ("error" in userRepos) {
			return userRepos;
		}

		return {
			...userData,
			repos: userRepos
		} as const;
	} catch (error) {
		return {
			error: {
				message: error instanceof Error ? `Error: ${error.message}` : `Error: ${error}`,
				status: 500
			}
		} as const;
	}
}

export async function getGithubUserData(username: string) {
	try {
		if (!username) {
			return {
				error: {
					message: "Username is required",
					status: 400
				}
			} as const;
		}

		const response = await fetch(`https://api.github.com/users/${username}`);

		if (!response.ok) {
			return {
				error: {
					message: "User not found",
					status: response.status
				}
			} as const;
		}

		const data: IGithubUserData = await response.json();

		return data;
	} catch (error) {
		return {
			error: {
				message: error instanceof Error ? `Error: ${error.message}` : `Error: ${error}`,
				status: 500
			}
		} as const;
	}
}

export async function getGithubUserRepos(username: string) {
	try {
		if (!username) {
			return {
				error: {
					message: "Username is required",
					status: 400
				}
			} as const;
		}

		const response = await fetch(`https://api.github.com/users/${username}/repos`);

		if (!response.ok) {
			return {
				error: {
					message: "User not found",
					status: response.status
				}
			} as const;
		}

		const data: IGithubUserRepo[] = await response.json();

		return data;
	} catch (error) {
		return {
			error: {
				message: error instanceof Error ? `Error: ${error.message}` : `Error: ${error}`,
				status: 500
			}
		} as const;
	}
}

export async function getGithubRawFile(fileData: IGetGithubRawFileProps) {
	try {
		const { owner, repo, branch, filepath } = fileData;

		if (!owner || !repo || !branch || !filepath) {
			return {
				error: {
					message: "Owner, repo, branch and filepath are required",
					status: 400
				}
			} as const;
		}

		const response = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${filepath}`);

		if (!response.ok) {
			return {
				error: {
					message: "File not found",
					status: response.status
				}
			} as const;
		}

		const data = await response.text();

		return data;
	} catch (error) {
		return {
			error: {
				message: error instanceof Error ? `Error: ${error.message}` : `Error: ${error}`,
				status: 500
			}
		} as const;
	}
}