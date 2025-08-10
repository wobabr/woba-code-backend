import { JwtService } from '@infra/auth/jwt.service';
import jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken');
jest.mock('@shared/config/app.config', () => ({
  ConfigService: {
    get: () => ({ jwtSecret: 'test-secret' })
  }
}));

describe('JwtService', () => {
  let service: JwtService;
  const mockJwt = jwt as jest.Mocked<typeof jwt>;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new JwtService();
  });

  it('should sign payload with jwt', () => {
    const payload = { userId: 1, role: 'CANDIDATE' };
    const token = 'jwt-token-123';
    mockJwt.sign.mockReturnValue(token as any);

    const result = service.sign(payload);
    expect(result).toBe(token);
    expect(mockJwt.sign).toHaveBeenCalledWith(payload, 'test-secret', { expiresIn: '1h' });
  });

  it('should verify token with jwt', () => {
    const token = 'jwt-token-123';
    const payload = { userId: 1, role: 'CANDIDATE' };
    mockJwt.verify.mockReturnValue(payload as any);

    const result = service.verify(token);
    expect(result).toBe(payload);
    expect(mockJwt.verify).toHaveBeenCalledWith(token, 'test-secret');
  });
}); 