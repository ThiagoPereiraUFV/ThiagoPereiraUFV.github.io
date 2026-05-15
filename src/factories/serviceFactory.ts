// Dependency Injection Container following SOLID principles
import { GithubApiService, LowCodeApiService } from '@/services/apiServices';
import { GithubRepository, LowCodeRepository } from '@/repositories/dataRepositories';
import { IGithubRepository, ILowCodeRepository } from '@/interfaces/services';

// Service Factory following Factory Pattern
export class ServiceFactory {
  private static githubRepository: IGithubRepository;
  private static lowCodeRepository: ILowCodeRepository;

  static getGithubRepository(): IGithubRepository {
    if (!this.githubRepository) {
      const githubApiService = new GithubApiService();
      this.githubRepository = new GithubRepository(githubApiService);
    }
    return this.githubRepository;
  }

  static getLowCodeRepository(): ILowCodeRepository {
    if (!this.lowCodeRepository) {
      const lowCodeApiService = new LowCodeApiService();
      this.lowCodeRepository = new LowCodeRepository(lowCodeApiService);
    }
    return this.lowCodeRepository;
  }

  // For testing - allows injection of mock services
  static setGithubRepository(repository: IGithubRepository): void {
    this.githubRepository = repository;
  }

  static setLowCodeRepository(repository: ILowCodeRepository): void {
    this.lowCodeRepository = repository;
  }

  // Reset for testing
  static reset(): void {
    this.githubRepository = null as unknown as IGithubRepository;
    this.lowCodeRepository = null as unknown as ILowCodeRepository;
  }
}