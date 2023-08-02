const AuthenticationRepository = require('../../../Domains/authentications/AuthenticationRepository');
const AuthLogoutUseCase = require('../AuthLogoutUseCase');

describe('AuthAuthLogoutUseCase', () => {
  it('should throw error if use case payload not contain refresh token', async () => {
    // Arrange
    const useCasePayload = {};
    const authLogoutUseCase = new AuthLogoutUseCase({});

    // Action & Assert
    await expect(authLogoutUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN');
  });

  it('should throw error if refresh token not string', async () => {
    // Arrange
    const useCasePayload = {
      refreshToken: 123,
    };
    const authLogoutUseCase = new AuthLogoutUseCase({});

    // Action & Assert
    await expect(authLogoutUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating the delete authentication action correctly', async () => {
    // Arrange
    const useCasePayload = {
      refreshToken: 'refreshToken',
    };
    const mockAuthenticationRepository = new AuthenticationRepository();
    mockAuthenticationRepository.checkAvailableToken = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockAuthenticationRepository.deleteToken = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const authLogoutUseCase = new AuthLogoutUseCase({
      authenticationRepository: mockAuthenticationRepository,
    });

    // Act
    await authLogoutUseCase.execute(useCasePayload);

    // Assert
    expect(mockAuthenticationRepository.checkAvailableToken)
      .toHaveBeenCalledWith(useCasePayload.refreshToken);
    expect(mockAuthenticationRepository.deleteToken)
      .toHaveBeenCalledWith(useCasePayload.refreshToken);
  });
});
