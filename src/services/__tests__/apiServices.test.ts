import { GithubApiService, LowCodeApiService } from '../apiServices';
import { mockGithubUser, mockGithubRepo, mockLowCodeProject, mockFetch } from '../../testUtils';

// Mock fetch globally
global.fetch = jest.fn();

describe('GithubApiService', () => {
  let service: GithubApiService;

  beforeEach(() => {
    service = new GithubApiService();
    jest.clearAllMocks();
  });

  describe('getUserData', () => {
    it('should return user data when API call succeeds', async () => {
      (global.fetch as jest.Mock) = mockFetch(mockGithubUser);

      const result = await service.getUserData('testuser');

      expect(result.data).toEqual(mockGithubUser);
      expect(result.error).toBeUndefined();
      expect(global.fetch).toHaveBeenCalledWith('https://api.github.com/users/testuser');
    });

    it('should return error when username is empty', async () => {
      const result = await service.getUserData('');

      expect(result.error).toEqual({
        message: 'Username is required',
        status: 400
      });
      expect(result.data).toBeUndefined();
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should return error when API returns 404', async () => {
      const errorResponse = { message: 'Not Found' };
      (global.fetch as jest.Mock) = mockFetch(errorResponse, 404, false);

      const result = await service.getUserData('nonexistent');

      expect(result.error).toEqual({
        message: 'User not found',
        details: errorResponse,
        status: 404
      });
      expect(result.data).toBeUndefined();
    });

    it('should handle network errors', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      const result = await service.getUserData('testuser');

      expect(result.error).toEqual({
        message: 'Error: Network error',
        status: 500
      });
      expect(result.data).toBeUndefined();
    });

    it('should handle non-Error exceptions', async () => {
      (global.fetch as jest.Mock).mockRejectedValue('String error');

      const result = await service.getUserData('testuser');

      expect(result.error).toEqual({
        message: 'Error: String error',
        status: 500
      });
    });
  });

  describe('getUserRepos', () => {
    it('should return repositories when API call succeeds', async () => {
      const repos = [mockGithubRepo];
      (global.fetch as jest.Mock) = mockFetch(repos);

      const result = await service.getUserRepos('testuser');

      expect(result.data).toEqual(repos);
      expect(result.error).toBeUndefined();
      expect(global.fetch).toHaveBeenCalledWith('https://api.github.com/users/testuser/repos');
    });

    it('should return error when username is empty', async () => {
      const result = await service.getUserRepos('');

      expect(result.error).toEqual({
        message: 'Username is required',
        status: 400
      });
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should handle API errors', async () => {
      (global.fetch as jest.Mock) = mockFetch({}, 500, false);

      const result = await service.getUserRepos('testuser');

      expect(result.error).toEqual({
        message: 'User not found',
        status: 500
      });
    });
  });

  describe('getRawFile', () => {
    const fileData = {
      owner: 'testuser',
      repo: 'testrepo',
      branch: 'main',
      filepath: 'README.md'
    };

    it('should return file content when API call succeeds', async () => {
      const fileContent = '# Test README';
      (global.fetch as jest.Mock) = mockFetch(fileContent);

      const result = await service.getRawFile(fileData);

      expect(result.data).toBe(fileContent);
      expect(result.error).toBeUndefined();
      expect(global.fetch).toHaveBeenCalledWith(
        'https://raw.githubusercontent.com/testuser/testrepo/main/README.md'
      );
    });

    it('should return error when required parameters are missing', async () => {
      const incompleteData = { owner: 'testuser', repo: '', branch: 'main', filepath: 'README.md' };

      const result = await service.getRawFile(incompleteData);

      expect(result.error).toEqual({
        message: 'Owner, repo, branch and filepath are required',
        status: 400
      });
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should handle file not found errors', async () => {
      (global.fetch as jest.Mock) = mockFetch('', 404, false);

      const result = await service.getRawFile(fileData);

      expect(result.error).toEqual({
        message: 'File not found',
        status: 404
      });
    });

    it('should handle network errors', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      const result = await service.getRawFile(fileData);

      expect(result.error).toEqual({
        message: 'Error: Network error',
        status: 500
      });
    });
  });
});

describe('LowCodeApiService', () => {
  let service: LowCodeApiService;

  beforeEach(() => {
    service = new LowCodeApiService();
    jest.clearAllMocks();
  });

  describe('getProjects', () => {
    it('should return projects when API call succeeds', async () => {
      const projects = [mockLowCodeProject];
      (global.fetch as jest.Mock) = mockFetch(projects);

      const result = await service.getProjects();

      expect(result.data).toEqual(projects);
      expect(result.error).toBeUndefined();
      expect(global.fetch).toHaveBeenCalledWith(
        'https://n8n-jtjw.onrender.com/webhook/8319d94b-07a7-4a24-8e35-d9696c68c1d9/workflows'
      );
    });

    it('should handle API errors', async () => {
      (global.fetch as jest.Mock) = mockFetch({}, 500, false);

      const result = await service.getProjects();

      expect(result.error).toEqual({
        message: 'Projects not found',
        status: 500
      });
    });

    it('should handle network errors', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      const result = await service.getProjects();

      expect(result.error).toEqual({
        message: 'Error: Network error',
        status: 500
      });
    });

    it('should handle non-Error exceptions', async () => {
      (global.fetch as jest.Mock).mockRejectedValue('String error');

      const result = await service.getProjects();

      expect(result.error).toEqual({
        message: 'Error: String error',
        status: 500
      });
    });
  });
});