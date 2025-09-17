import { ServiceFactory } from '../serviceFactory';
import { IGithubRepository, ILowCodeRepository } from '../../interfaces/services';

describe('ServiceFactory', () => {
  afterEach(() => {
    ServiceFactory.reset();
  });

  describe('getGithubRepository', () => {
    it('should return a singleton instance of GithubRepository', () => {
      const repo1 = ServiceFactory.getGithubRepository();
      const repo2 = ServiceFactory.getGithubRepository();

      expect(repo1).toBe(repo2);
      expect(repo1).toBeDefined();
    });

    it('should return an object that implements IGithubRepository', () => {
      const repo = ServiceFactory.getGithubRepository();

      expect(repo).toHaveProperty('getGithubData');
      expect(repo).toHaveProperty('getGithubUserData');
      expect(repo).toHaveProperty('getGithubUserRepos');
      expect(repo).toHaveProperty('getGithubRawFile');
      expect(typeof repo.getGithubData).toBe('function');
      expect(typeof repo.getGithubUserData).toBe('function');
      expect(typeof repo.getGithubUserRepos).toBe('function');
      expect(typeof repo.getGithubRawFile).toBe('function');
    });
  });

  describe('getLowCodeRepository', () => {
    it('should return a singleton instance of LowCodeRepository', () => {
      const repo1 = ServiceFactory.getLowCodeRepository();
      const repo2 = ServiceFactory.getLowCodeRepository();

      expect(repo1).toBe(repo2);
      expect(repo1).toBeDefined();
    });

    it('should return an object that implements ILowCodeRepository', () => {
      const repo = ServiceFactory.getLowCodeRepository();

      expect(repo).toHaveProperty('getLowCodeProjects');
      expect(typeof repo.getLowCodeProjects).toBe('function');
    });
  });

  describe('setGithubRepository', () => {
    it('should allow setting a custom GithubRepository implementation', () => {
      const mockRepository: IGithubRepository = {
        getGithubData: jest.fn(),
        getGithubUserData: jest.fn(),
        getGithubUserRepos: jest.fn(),
        getGithubRawFile: jest.fn(),
      };

      ServiceFactory.setGithubRepository(mockRepository);
      const repo = ServiceFactory.getGithubRepository();

      expect(repo).toBe(mockRepository);
    });

    it('should return the same custom instance on subsequent calls', () => {
      const mockRepository: IGithubRepository = {
        getGithubData: jest.fn(),
        getGithubUserData: jest.fn(),
        getGithubUserRepos: jest.fn(),
        getGithubRawFile: jest.fn(),
      };

      ServiceFactory.setGithubRepository(mockRepository);
      const repo1 = ServiceFactory.getGithubRepository();
      const repo2 = ServiceFactory.getGithubRepository();

      expect(repo1).toBe(repo2);
      expect(repo1).toBe(mockRepository);
    });
  });

  describe('setLowCodeRepository', () => {
    it('should allow setting a custom LowCodeRepository implementation', () => {
      const mockRepository: ILowCodeRepository = {
        getLowCodeProjects: jest.fn(),
      };

      ServiceFactory.setLowCodeRepository(mockRepository);
      const repo = ServiceFactory.getLowCodeRepository();

      expect(repo).toBe(mockRepository);
    });

    it('should return the same custom instance on subsequent calls', () => {
      const mockRepository: ILowCodeRepository = {
        getLowCodeProjects: jest.fn(),
      };

      ServiceFactory.setLowCodeRepository(mockRepository);
      const repo1 = ServiceFactory.getLowCodeRepository();
      const repo2 = ServiceFactory.getLowCodeRepository();

      expect(repo1).toBe(repo2);
      expect(repo1).toBe(mockRepository);
    });
  });

  describe('reset', () => {
    it('should reset the GitHub repository instance', () => {
      const repo1 = ServiceFactory.getGithubRepository();
      ServiceFactory.reset();
      const repo2 = ServiceFactory.getGithubRepository();

      expect(repo1).not.toBe(repo2);
    });

    it('should reset the LowCode repository instance', () => {
      const repo1 = ServiceFactory.getLowCodeRepository();
      ServiceFactory.reset();
      const repo2 = ServiceFactory.getLowCodeRepository();

      expect(repo1).not.toBe(repo2);
    });

    it('should allow setting new instances after reset', () => {
      const mockGithubRepo: IGithubRepository = {
        getGithubData: jest.fn(),
        getGithubUserData: jest.fn(),
        getGithubUserRepos: jest.fn(),
        getGithubRawFile: jest.fn(),
      };

      const mockLowCodeRepo: ILowCodeRepository = {
        getLowCodeProjects: jest.fn(),
      };

      ServiceFactory.setGithubRepository(mockGithubRepo);
      ServiceFactory.setLowCodeRepository(mockLowCodeRepo);
      
      expect(ServiceFactory.getGithubRepository()).toBe(mockGithubRepo);
      expect(ServiceFactory.getLowCodeRepository()).toBe(mockLowCodeRepo);

      ServiceFactory.reset();

      const newGithubRepo = ServiceFactory.getGithubRepository();
      const newLowCodeRepo = ServiceFactory.getLowCodeRepository();

      expect(newGithubRepo).not.toBe(mockGithubRepo);
      expect(newLowCodeRepo).not.toBe(mockLowCodeRepo);
    });
  });

  describe('dependency injection pattern', () => {
    it('should implement the Factory pattern correctly', () => {
      // Test that factory methods return consistent instances
      const githubRepo1 = ServiceFactory.getGithubRepository();
      const githubRepo2 = ServiceFactory.getGithubRepository();
      const lowCodeRepo1 = ServiceFactory.getLowCodeRepository();
      const lowCodeRepo2 = ServiceFactory.getLowCodeRepository();

      expect(githubRepo1).toBe(githubRepo2);
      expect(lowCodeRepo1).toBe(lowCodeRepo2);
      expect(githubRepo1).not.toBe(lowCodeRepo1); // Different instances for different services
    });

    it('should support dependency inversion for testing', () => {
      const originalGithubRepo = ServiceFactory.getGithubRepository();
      
      const mockRepository: IGithubRepository = {
        getGithubData: jest.fn().mockResolvedValue({ data: 'mocked' }),
        getGithubUserData: jest.fn(),
        getGithubUserRepos: jest.fn(),
        getGithubRawFile: jest.fn(),
      };

      ServiceFactory.setGithubRepository(mockRepository);
      const injectedRepo = ServiceFactory.getGithubRepository();

      expect(injectedRepo).toBe(mockRepository);
      expect(injectedRepo).not.toBe(originalGithubRepo);
    });
  });
});