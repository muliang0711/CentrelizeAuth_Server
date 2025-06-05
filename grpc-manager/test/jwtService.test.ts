import { tokenManager } from '../src/service/jwtService';

describe('tokenManager', () => {
  it('generateToken returns a token string', () => {
    const payload = { uuid: '123', email: 'test@example.com', name: 'Test' };
    const token = tokenManager.generateToken(payload);
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(0);
  });

  it('verifyToken validates token and returns original payload', () => {
    const payload = { uuid: '123', email: 'test@example.com', name: 'Test' };
    const token = tokenManager.generateToken(payload);
    const result = tokenManager.verifyToken(token);
    expect(result.valid).toBe(true);
    expect(result.payload).toEqual(payload);
  });
});
