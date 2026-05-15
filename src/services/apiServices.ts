// Repository implementations following Single Responsibility Principle
import { IGithubApiService, ILowCodeApiService, IApiResult } from '@/interfaces/services';
import { IGithubUserData, IGithubUserRepo } from '@/interfaces/github';
import { ILowCodeProject } from '@/interfaces/low-code-projects';
import { IGetGithubRawFileProps } from '@/interfaces/actions';

// GitHub API Service Implementation
export class GithubApiService implements IGithubApiService {
  private baseUrl = 'https://api.github.com';
  private rawBaseUrl = 'https://raw.githubusercontent.com';

  async getUserData(username: string): Promise<IApiResult<IGithubUserData>> {
    if (!username) {
      return {
        error: {
          message: "Username is required",
          status: 400
        }
      };
    }

    try {
      const response = await fetch(`${this.baseUrl}/users/${username}`);
      
      if (!response.ok) {
        return {
          error: {
            message: "User not found",
            details: await response.json(),
            status: response.status
          }
        };
      }

      const data: IGithubUserData = await response.json();
      return { data };
    } catch (error) {
      return {
        error: {
          message: error instanceof Error ? `Error: ${error.message}` : `Error: ${error}`,
          status: 500
        }
      };
    }
  }

  async getUserRepos(username: string): Promise<IApiResult<IGithubUserRepo[]>> {
    if (!username) {
      return {
        error: {
          message: "Username is required",
          status: 400
        }
      };
    }

    try {
      const response = await fetch(`${this.baseUrl}/users/${username}/repos`);
      
      if (!response.ok) {
        return {
          error: {
            message: "User not found",
            status: response.status
          }
        };
      }

      const data: IGithubUserRepo[] = await response.json();
      return { data };
    } catch (error) {
      return {
        error: {
          message: error instanceof Error ? `Error: ${error.message}` : `Error: ${error}`,
          status: 500
        }
      };
    }
  }

  async getRawFile(fileData: IGetGithubRawFileProps): Promise<IApiResult<string>> {
    const { owner, repo, branch, filepath } = fileData;

    if (!owner || !repo || !branch || !filepath) {
      return {
        error: {
          message: "Owner, repo, branch and filepath are required",
          status: 400
        }
      };
    }

    try {
      const response = await fetch(`${this.rawBaseUrl}/${owner}/${repo}/${branch}/${filepath}`);
      
      if (!response.ok) {
        return {
          error: {
            message: "File not found",
            status: response.status
          }
        };
      }

      const data = await response.text();
      return { data };
    } catch (error) {
      return {
        error: {
          message: error instanceof Error ? `Error: ${error.message}` : `Error: ${error}`,
          status: 500
        }
      };
    }
  }
}

// Low-Code API Service Implementation
export class LowCodeApiService implements ILowCodeApiService {
  private webhookUrl = "https://n8n-jtjw.onrender.com/webhook/8319d94b-07a7-4a24-8e35-d9696c68c1d9/workflows";

  async getProjects(): Promise<IApiResult<ILowCodeProject[]>> {
    try {
      const response = await fetch(this.webhookUrl);
      
      if (!response.ok) {
        return {
          error: {
            message: "Projects not found",
            status: response.status
          }
        };
      }

      const data: ILowCodeProject[] = await response.json();
      return { data };
    } catch (error) {
      return {
        error: {
          message: error instanceof Error ? `Error: ${error.message}` : `Error: ${error}`,
          status: 500
        }
      };
    }
  }
}