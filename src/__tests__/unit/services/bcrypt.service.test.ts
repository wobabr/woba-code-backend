import { BcryptService } from '@infra/auth/bcrypt.service';
import bcrypt from 'bcryptjs';

jest.mock('bcryptjs');

describe('BcryptService', () => {
  let service: BcryptService;
  const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new BcryptService();
  });

  it('should hash password with bcrypt', async () => {
    const password = 'password123';
    const hashedPassword = 'hashedPassword123';
    mockBcrypt.hash.mockResolvedValue(hashedPassword as never);

    const result = await service.hash(password);
    expect(result).toBe(hashedPassword);
    expect(mockBcrypt.hash).toHaveBeenCalledWith(password, 10);
  });

  it('should compare password with hash', async () => {
    const password = 'password123';
    const hash = 'hashedPassword123';
    mockBcrypt.compare.mockResolvedValue(true as never);

    const result = await service.compare(password, hash);
    expect(result).toBe(true);
    expect(mockBcrypt.compare).toHaveBeenCalledWith(password, hash);
  });

  it('should return false when password does not match hash', async () => {
    const password = 'password123';
    const hash = 'hashedPassword123';
    mockBcrypt.compare.mockResolvedValue(false as never);

    const result = await service.compare(password, hash);
    expect(result).toBe(false);
    expect(mockBcrypt.compare).toHaveBeenCalledWith(password, hash);
  });
}); 