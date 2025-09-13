import { GithubRepository, LowCodeRepository } from '../dataRepositories';
import { IGithubApiService, ILowCodeApiService } from '../../interfaces/services';
import { mockGithubUser, mockGithubRepo, mockLowCodeProject } from '../../testUtils';

describe('GithubRepository', () => {
  let repository: GithubRepository;
  let mockApiService: jest.Mocked<IGithubApiService>;

  beforeEach(() => {
    mockApiService = {
      getUserData: jest.fn(),
      getUserRepos: jest.fn(),
      getRawFile: jest.fn(),
    };
    repository = new GithubRepository(mockApiService);
  });

  describe('getGithubData', () => {
    it('should return combined user data and repos when both API calls succeed', async () => {
      mockApiService.getUserData.mockResolvedValue({ data: mockGithubUser });
      mockApiService.getUserRepos.mockResolvedValue({ data: [mockGithubRepo] });

      const result = await repository.getGithubData('testuser');

      expect(result).toEqual({
        ...mockGithubUser,
        repos: [mockGithubRepo]
      });
      expect(mockApiService.getUserData).toHaveBeenCalledWith('testuser');
      expect(mockApiService.getUserRepos).toHaveBeenCalledWith('testuser');
    });

    it('should return error when username is empty', async () => {
      const result = await repository.getGithubData('');

      expect(result).toEqual({
        error: {
          message: 'Username is required',
          status: 400
        }
      });
      expect(mockApiService.getUserData).not.toHaveBeenCalled();
      expect(mockApiService.getUserRepos).not.toHaveBeenCalled();
    });

    it('should return error when getUserData fails', async () => {
      const error = { message: 'User not found', status: 404 };
      mockApiService.getUserData.mockResolvedValue({ error });
      mockApiService.getUserRepos.mockResolvedValue({ data: [mockGithubRepo] });

      const result = await repository.getGithubData('testuser');

      expect(result).toEqual({ error });
      expect(mockApiService.getUserData).toHaveBeenCalledWith('testuser');
      expect(mockApiService.getUserRepos).toHaveBeenCalledWith('testuser');
    });

    it('should return error when getUserRepos fails', async () => {
      const error = { message: 'Repos not found', status: 404 };
      mockApiService.getUserData.mockResolvedValue({ data: mockGithubUser });
      mockApiService.getUserRepos.mockResolvedValue({ error });

      const result = await repository.getGithubData('testuser');

      expect(result).toEqual({ error });
    });

    it('should handle exceptions and return error', async () => {
      mockApiService.getUserData.mockRejectedValue(new Error('Network error'));

      const result = await repository.getGithubData('testuser');

      expect(result).toEqual({
        error: {
          message: 'Error: Network error',
          status: 500
        }
      });
    });

    it('should handle non-Error exceptions', async () => {
      mockApiService.getUserData.mockRejectedValue('String error');

      const result = await repository.getGithubData('testuser');

      expect(result).toEqual({
        error: {
          message: 'Error: String error',
          status: 500
        }
      });
    });
  });

  describe('getGithubUserData', () => {
    it('should return user data when API call succeeds', async () => {
      mockApiService.getUserData.mockResolvedValue({ data: mockGithubUser });

      const result = await repository.getGithubUserData('testuser');

      expect(result).toEqual(mockGithubUser);
      expect(mockApiService.getUserData).toHaveBeenCalledWith('testuser');
    });

    it('should return error when API call fails', async () => {
      const error = { message: 'User not found', status: 404 };
      mockApiService.getUserData.mockResolvedValue({ error });

      const result = await repository.getGithubUserData('testuser');

      expect(result).toEqual({ error });
    });
  });

  describe('getGithubUserRepos', () => {
    it('should return repositories when API call succeeds', async () => {
      mockApiService.getUserRepos.mockResolvedValue({ data: [mockGithubRepo] });

      const result = await repository.getGithubUserRepos('testuser');

      expect(result).toEqual([mockGithubRepo]);
      expect(mockApiService.getUserRepos).toHaveBeenCalledWith('testuser');
    });

    it('should return error when API call fails', async () => {
      const error = { message: 'Repos not found', status: 404 };
      mockApiService.getUserRepos.mockResolvedValue({ error });

      const result = await repository.getGithubUserRepos('testuser');

      expect(result).toEqual({ error });
    });
  });

  describe('getGithubRawFile', () => {
    const fileData = {
      owner: 'testuser',
      repo: 'testrepo',
      branch: 'main',
      filepath: 'README.md'
    };

    it('should return file content when API call succeeds', async () => {
      const fileContent = '# Test README';
      mockApiService.getRawFile.mockResolvedValue({ data: fileContent });

      const result = await repository.getGithubRawFile(fileData);

      expect(result).toBe(fileContent);
      expect(mockApiService.getRawFile).toHaveBeenCalledWith(fileData);
    });

    it('should return error when API call fails', async () => {
      const error = { message: 'File not found', status: 404 };
      mockApiService.getRawFile.mockResolvedValue({ error });

      const result = await repository.getGithubRawFile(fileData);

      expect(result).toEqual({ error });
    });
  });
});

describe('LowCodeRepository', () => {
  let repository: LowCodeRepository;
  let mockApiService: jest.Mocked<ILowCodeApiService>;

  beforeEach(() => {
    mockApiService = {
      getProjects: jest.fn(),
    };
    repository = new LowCodeRepository(mockApiService);
  });

  describe('getLowCodeProjects', () => {
    it('should return projects when API call succeeds', async () => {
      mockApiService.getProjects.mockResolvedValue({ data: [mockLowCodeProject] });

      const result = await repository.getLowCodeProjects();

      expect(result).toEqual([mockLowCodeProject]);
      expect(mockApiService.getProjects).toHaveBeenCalled();
    });

    it('should return error when API call fails', async () => {
      const error = { message: 'Projects not found', status: 404 };
      mockApiService.getProjects.mockResolvedValue({ error });

      const result = await repository.getLowCodeProjects();

      expect(result).toEqual({ error });
    });
  });
});