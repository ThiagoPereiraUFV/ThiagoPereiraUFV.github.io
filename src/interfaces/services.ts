// Services layer following Dependency Inversion Principle
export interface IGithubApiService {
  getUserData(username: string): Promise<any>;
  getUserRepos(username: string): Promise<any>;
  getRawFile(fileData: any): Promise<any>;
}

export interface ILowCodeApiService {
  getProjects(): Promise<any>;
}

// Repository interfaces for data access
export interface IGithubRepository {
  getGithubData(username: string): Promise<any>;
  getGithubUserData(username: string): Promise<any>;
  getGithubUserRepos(username: string): Promise<any>;
  getGithubRawFile(fileData: any): Promise<any>;
}

export interface ILowCodeRepository {
  getLowCodeProjects(): Promise<any>;
}

// Error handling interfaces
export interface IApiError {
  message: string;
  status: number;
  details?: any;
}

export interface IApiResult<T> {
  data?: T;
  error?: IApiError;
}