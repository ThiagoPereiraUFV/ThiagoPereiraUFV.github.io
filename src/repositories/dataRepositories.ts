// Repository pattern implementation following Dependency Inversion Principle
import { IGithubRepository, ILowCodeRepository, IGithubApiService, ILowCodeApiService } from '@/interfaces/services';
import { IGetGithubRawFileProps } from '@/interfaces/actions';

export class GithubRepository implements IGithubRepository {
  constructor(private apiService: IGithubApiService) {}

  async getGithubData(username: string) {
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
        this.getGithubUserData(username),
        this.getGithubUserRepos(username)
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

  async getGithubUserData(username: string) {
    const result = await this.apiService.getUserData(username);
    
    if (result.error) {
      return {
        error: result.error
      } as const;
    }

    return result.data!;
  }

  async getGithubUserRepos(username: string) {
    const result = await this.apiService.getUserRepos(username);
    
    if (result.error) {
      return {
        error: result.error
      } as const;
    }

    return result.data!;
  }

  async getGithubRawFile(fileData: IGetGithubRawFileProps) {
    const result = await this.apiService.getRawFile(fileData);
    
    if (result.error) {
      return {
        error: result.error
      } as const;
    }

    return result.data!;
  }
}

export class LowCodeRepository implements ILowCodeRepository {
  constructor(private apiService: ILowCodeApiService) {}

  async getLowCodeProjects() {
    const result = await this.apiService.getProjects();
    
    if (result.error) {
      return {
        error: result.error
      } as const;
    }

    return result.data!;
  }
}