const AuthenticationRepository = require('../../../Domains/authentications/AuthenticationRepository');
const AuthenticationTokenManager = require('../../security/AuthenticationTokenManager');
const AuthUpdateUseCase = require('../AuthUpdateUseCase');

describe('AuthUpdateUseCase', () => {
  it('should throw error if use case payload not contain refresh token', async () => {
    // Arrange
    const useCasePayload = {};
    const authUpdateUseCase = new AuthUpdateUseCase({});
    
    // Action & Assert
    await expect(authUpdateUseCase.execute(useCasePayload))
      .rejects.toThrowError('REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN');
  });

  it('should throw error if refresh token not string', async () => {
    // Arrange
    const useCasePayload = {
      refreshToken: 1,
    };
    
    const authUpdateUseCase = new AuthUpdateUseCase({});
    
    // Action & Assert
    await expect(authUpdateUseCase.execute(useCasePayload))
      .rejects.toThrowError('REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating the refresh authentication action correctly', async () => {
    // Arrange
    const useCasePayload = {
      refreshToken: 'some_refresh_token',
    };
    
    const mockAuthenticationRepository = new AuthenticationRepository();
    const mockAuthenticationTokenManager = new AuthenticationTokenManager();
    
    /* Mocking */
    mockAuthenticationRepository.checkAvailableToken = jest.fn().mockImplementation(() => Promise.resolve());
    mockAuthenticationTokenManager.verifyRefreshToken = jest.fn().mockImplementation(() => Promise.resolve());
    mockAuthenticationTokenManager.decodePayload = jest.fn().mockImplementation(() => {
      return Promise.resolve({ id: 'user-123', role: 'admin', username: 'dicoding' });
    });
    mockAuthenticationTokenManager.createAccessToken = jest.fn().mockImplementation(() => Promise.resolve('some_new_access_token'));
    
    /* Create the use case instace */
    const authUpdateUseCase = new AuthUpdateUseCase({
      authenticationRepository: mockAuthenticationRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
    });
    
    // Action
    const accessToken = await authUpdateUseCase.execute(useCasePayload);
    
    // Assert
    expect(mockAuthenticationTokenManager.verifyRefreshToken).toBeCalledWith(useCasePayload.refreshToken);
    expect(mockAuthenticationRepository.checkAvailableToken).toBeCalledWith(useCasePayload.refreshToken);
    expect(mockAuthenticationTokenManager.decodePayload).toBeCalledWith(useCasePayload.refreshToken);
    expect(mockAuthenticationTokenManager.createAccessToken).toBeCalledWith({ id: 'user-123', role: 'admin', username: 'dicoding' });
    expect(accessToken).toEqual('some_new_access_token');
  });
});
