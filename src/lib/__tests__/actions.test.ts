import { 
  getGithubData, 
  getGithubUserData, 
  getGithubUserRepos, 
  getGithubRawFile, 
  getLowCodeProjects 
} from '../actions';
import { ServiceFactory } from '../../factories/serviceFactory';
import { IGithubRepository, ILowCodeRepository } from '../../interfaces/services';
import { mockGithubUser, mockGithubRepo, mockLowCodeProject } from '../../testUtils';

// Mock the ServiceFactory
jest.mock('../../factories/serviceFactory');

describe('actions', () => {
  let mockGithubRepository: jest.Mocked<IGithubRepository>;
  let mockLowCodeRepository: jest.Mocked<ILowCodeRepository>;

  beforeEach(() => {
    mockGithubRepository = {
      getGithubData: jest.fn(),
      getGithubUserData: jest.fn(),
      getGithubUserRepos: jest.fn(),
      getGithubRawFile: jest.fn(),
    };

    mockLowCodeRepository = {
      getLowCodeProjects: jest.fn(),
    };

    (ServiceFactory.getGithubRepository as jest.Mock).mockReturnValue(mockGithubRepository);
    (ServiceFactory.getLowCodeRepository as jest.Mock).mockReturnValue(mockLowCodeRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getGithubData', () => {
    it('should call repository getGithubData method with correct username', async () => {
      const expectedResult = { ...mockGithubUser, repos: [mockGithubRepo] };
      mockGithubRepository.getGithubData.mockResolvedValue(expectedResult);

      const result = await getGithubData('testuser');

      expect(ServiceFactory.getGithubRepository).toHaveBeenCalled();
      expect(mockGithubRepository.getGithubData).toHaveBeenCalledWith('testuser');
      expect(result).toEqual(expectedResult);
    });

    it('should handle error responses from repository', async () => {
      const errorResult = {
        error: {
          message: 'User not found',
          status: 404
        }
      };
      mockGithubRepository.getGithubData.mockResolvedValue(errorResult);

      const result = await getGithubData('nonexistent');

      expect(result).toEqual(errorResult);
      expect(mockGithubRepository.getGithubData).toHaveBeenCalledWith('nonexistent');
    });

    it('should pass empty string to repository', async () => {
      const errorResult = {
        error: {
          message: 'Username is required',
          status: 400
        }
      };
      mockGithubRepository.getGithubData.mockResolvedValue(errorResult);

      const result = await getGithubData('');

      expect(result).toEqual(errorResult);
      expect(mockGithubRepository.getGithubData).toHaveBeenCalledWith('');
    });
  });

  describe('getGithubUserData', () => {
    it('should call repository getGithubUserData method with correct username', async () => {
      mockGithubRepository.getGithubUserData.mockResolvedValue(mockGithubUser);

      const result = await getGithubUserData('testuser');

      expect(ServiceFactory.getGithubRepository).toHaveBeenCalled();
      expect(mockGithubRepository.getGithubUserData).toHaveBeenCalledWith('testuser');
      expect(result).toEqual(mockGithubUser);
    });

    it('should handle error responses from repository', async () => {
      const errorResult = {
        error: {
          message: 'User not found',
          status: 404
        }
      };
      mockGithubRepository.getGithubUserData.mockResolvedValue(errorResult);

      const result = await getGithubUserData('nonexistent');

      expect(result).toEqual(errorResult);
    });
  });

  describe('getGithubUserRepos', () => {
    it('should call repository getGithubUserRepos method with correct username', async () => {
      const repos = [mockGithubRepo];
      mockGithubRepository.getGithubUserRepos.mockResolvedValue(repos);

      const result = await getGithubUserRepos('testuser');

      expect(ServiceFactory.getGithubRepository).toHaveBeenCalled();
      expect(mockGithubRepository.getGithubUserRepos).toHaveBeenCalledWith('testuser');
      expect(result).toEqual(repos);
    });

    it('should handle error responses from repository', async () => {
      const errorResult = {
        error: {
          message: 'Repos not found',
          status: 404
        }
      };
      mockGithubRepository.getGithubUserRepos.mockResolvedValue(errorResult);

      const result = await getGithubUserRepos('nonexistent');

      expect(result).toEqual(errorResult);
    });
  });

  describe('getGithubRawFile', () => {
    const fileData = {
      owner: 'testuser',
      repo: 'testrepo',
      branch: 'main',
      filepath: 'README.md'
    };

    it('should call repository getGithubRawFile method with correct file data', async () => {
      const fileContent = '# Test README';
      mockGithubRepository.getGithubRawFile.mockResolvedValue(fileContent);

      const result = await getGithubRawFile(fileData);

      expect(ServiceFactory.getGithubRepository).toHaveBeenCalled();
      expect(mockGithubRepository.getGithubRawFile).toHaveBeenCalledWith(fileData);
      expect(result).toBe(fileContent);
    });

    it('should handle error responses from repository', async () => {
      const errorResult = {
        error: {
          message: 'File not found',
          status: 404
        }
      };
      mockGithubRepository.getGithubRawFile.mockResolvedValue(errorResult);

      const result = await getGithubRawFile(fileData);

      expect(result).toEqual(errorResult);
    });

    it('should pass file data object correctly', async () => {
      const customFileData = {
        owner: 'anotheruser',
        repo: 'anotherrepo',
        branch: 'develop',
        filepath: 'package.json'
      };
      mockGithubRepository.getGithubRawFile.mockResolvedValue('{}');

      await getGithubRawFile(customFileData);

      expect(mockGithubRepository.getGithubRawFile).toHaveBeenCalledWith(customFileData);
    });
  });

  describe('getLowCodeProjects', () => {
    it('should call repository getLowCodeProjects method', async () => {
      const projects = [mockLowCodeProject];
      mockLowCodeRepository.getLowCodeProjects.mockResolvedValue(projects);

      const result = await getLowCodeProjects();

      expect(ServiceFactory.getLowCodeRepository).toHaveBeenCalled();
      expect(mockLowCodeRepository.getLowCodeProjects).toHaveBeenCalled();
      expect(result).toEqual(projects);
    });

    it('should handle error responses from repository', async () => {
      const errorResult = {
        error: {
          message: 'Projects not found',
          status: 404
        }
      };
      mockLowCodeRepository.getLowCodeProjects.mockResolvedValue(errorResult);

      const result = await getLowCodeProjects();

      expect(result).toEqual(errorResult);
    });

    it('should not require any parameters', async () => {
      mockLowCodeRepository.getLowCodeProjects.mockResolvedValue([]);

      await getLowCodeProjects();

      expect(mockLowCodeRepository.getLowCodeProjects).toHaveBeenCalledWith();
    });
  });

  describe('service factory integration', () => {
    it('should use ServiceFactory to get repository instances', async () => {
      await getGithubData('test');
      await getLowCodeProjects();

      expect(ServiceFactory.getGithubRepository).toHaveBeenCalled();
      expect(ServiceFactory.getLowCodeRepository).toHaveBeenCalled();
    });

    it('should call ServiceFactory methods for each action call', async () => {
      await getGithubData('test1');
      await getGithubUserData('test2');
      await getGithubUserRepos('test3');
      await getGithubRawFile({
        owner: 'test',
        repo: 'test',
        branch: 'test',
        filepath: 'test'
      });

      // Should call getGithubRepository for each GitHub-related action
      expect(ServiceFactory.getGithubRepository).toHaveBeenCalledTimes(4);
    });
  });
});