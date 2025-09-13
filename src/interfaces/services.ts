import { IGithubUserData, IGithubUserRepo } from './github';
import { ILowCodeProject } from './low-code-projects';
import { IGetGithubRawFileProps } from './actions';

// Services layer following Dependency Inversion Principle
export interface IGithubApiService {
  getUserData(username: string): Promise<IApiResult<IGithubUserData>>;
  getUserRepos(username: string): Promise<IApiResult<IGithubUserRepo[]>>;
  getRawFile(fileData: IGetGithubRawFileProps): Promise<IApiResult<string>>;
}

export interface ILowCodeApiService {
  getProjects(): Promise<IApiResult<ILowCodeProject[]>>;
}

// Repository interfaces for data access
export interface IGithubRepository {
  getGithubData(username: string): Promise<IGithubDataResponse>;
  getGithubUserData(username: string): Promise<IGithubUserData | IErrorResponse>;
  getGithubUserRepos(username: string): Promise<IGithubUserRepo[] | IErrorResponse>;
  getGithubRawFile(fileData: IGetGithubRawFileProps): Promise<string | IErrorResponse>;
}

export interface ILowCodeRepository {
  getLowCodeProjects(): Promise<ILowCodeProject[] | IErrorResponse>;
}

// Error handling interfaces
export interface IApiError {
  message: string;
  status: number;
  details?: unknown;
}

export interface IErrorResponse {
  error: IApiError;
}

export interface IGithubDataResponse {
  login?: string;
  name?: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
  blog?: string;
  public_repos?: number;
  followers?: number;
  following?: number;
  repos?: IGithubUserRepo[];
  error?: IApiError;
}

export interface IApiResult<T> {
  data?: T;
  error?: IApiError;
}