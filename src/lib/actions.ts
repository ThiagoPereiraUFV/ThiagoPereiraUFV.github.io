// Refactored actions using SOLID principles and dependency injection
import { IGetGithubRawFileProps } from "@/interfaces/actions";
import { ServiceFactory } from "@/factories/serviceFactory";

export async function getGithubData(username: string) {
  const githubRepository = ServiceFactory.getGithubRepository();
  return await githubRepository.getGithubData(username);
}

export async function getGithubUserData(username: string) {
  const githubRepository = ServiceFactory.getGithubRepository();
  return await githubRepository.getGithubUserData(username);
}

export async function getGithubUserRepos(username: string) {
  const githubRepository = ServiceFactory.getGithubRepository();
  return await githubRepository.getGithubUserRepos(username);
}

export async function getGithubRawFile(fileData: IGetGithubRawFileProps) {
  const githubRepository = ServiceFactory.getGithubRepository();
  return await githubRepository.getGithubRawFile(fileData);
}

export async function getLowCodeProjects() {
  const lowCodeRepository = ServiceFactory.getLowCodeRepository();
  return await lowCodeRepository.getLowCodeProjects();
}