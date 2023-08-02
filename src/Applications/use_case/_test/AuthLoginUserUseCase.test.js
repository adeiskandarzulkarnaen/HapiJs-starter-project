const UserRepository = require('../../../Domains/users/UserRepository');
const AuthenticationRepository = require('../../../Domains/authentications/AuthenticationRepository');
const AuthenticationTokenManager = require('../../security/AuthenticationTokenManager');
const PasswordHash = require('../../security/PasswordHash');
const AuthLoginUseCase = require('../AuthLoginUseCase');
const NewAuth = require('../../../Domains/authentications/entities/NewAuth');

describe('AuthLoginUseCase', () => {
  it('should orchestrating the get authentication action correctly', async () => {
    // Arrange
    const useCasePayload = {
      username: 'dicoding',
      password: 'secret',
    };
    const mockedAuthentication = new NewAuth({
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
    });

    /** creating dependency of use case */
    const mockUserRepository = new UserRepository();
    const mockAuthenticationRepository = new AuthenticationRepository();
    const mockAuthenticationTokenManager = new AuthenticationTokenManager();
    const mockPasswordHash = new PasswordHash();

    /** mocking needed function */
    mockUserRepository.getUserCredentialByUsername = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id: 'user-123',
        role: 'admin',
        password: 'encrypted_password',
      }));

    mockPasswordHash.comparePassword = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockAuthenticationTokenManager.createAccessToken = jest.fn()
      .mockImplementation(() => Promise.resolve(mockedAuthentication.accessToken));
    mockAuthenticationTokenManager.createRefreshToken = jest.fn()
      .mockImplementation(() => Promise.resolve(mockedAuthentication.refreshToken));
    mockAuthenticationRepository.addToken = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const authLoginUseCase = new AuthLoginUseCase({
      userRepository: mockUserRepository,
      authenticationRepository: mockAuthenticationRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
      passwordHash: mockPasswordHash,
    });

    // Action
    const actualAuthentication = await authLoginUseCase.execute(useCasePayload);

    // Assert
    expect(actualAuthentication).toEqual(new NewAuth({
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
    }));
    expect(mockUserRepository
      .getUserCredentialByUsername).toBeCalledWith('dicoding');
    expect(mockPasswordHash.comparePassword)
      .toBeCalledWith('secret', 'encrypted_password');
    expect(mockAuthenticationTokenManager.createAccessToken)
      .toBeCalledWith({ id: 'user-123', role: 'admin', username: 'dicoding' });
    expect(mockAuthenticationTokenManager.createRefreshToken)
      .toBeCalledWith({ id: 'user-123', role: 'admin', username: 'dicoding' });
    expect(mockAuthenticationRepository.addToken)
      .toBeCalledWith(mockedAuthentication.refreshToken);
  });
});
