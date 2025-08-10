import { CreateUserUseCase } from '@domain/use-cases/create-user.usecase';
import { User } from '@domain/entities/user.entity';
import { BusinessError } from '@domain/errors/domain.error';

describe('CreateUserUseCase', () => {
  const mockUserRepository = {
    findByEmail: jest.fn(),
    create: jest.fn()
  };

  let useCase: CreateUserUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new CreateUserUseCase(mockUserRepository as any);
  });

  it('should create a new user when email does not exist', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(null);
    const userData = { name: 'John', email: 'john@email.com', password: '123' };
    const createdUser = new User(userData.name, userData.email, userData.password);
    mockUserRepository.create.mockResolvedValue(createdUser);

    const result = await useCase.execute(userData);
    expect(result).toBe(createdUser);
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(userData.email);
    expect(mockUserRepository.create).toHaveBeenCalledWith(expect.any(User));
  });

  it('should throw BusinessError if user already exists', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(new User('John', 'john@email.com', '123'));
    const userData = { name: 'John', email: 'john@email.com', password: '123' };
    await expect(useCase.execute(userData)).rejects.toThrow(BusinessError);
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(userData.email);
    expect(mockUserRepository.create).not.toHaveBeenCalled();
  });
}); 