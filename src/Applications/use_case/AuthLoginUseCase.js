const UserLogin = require('../../Domains/users/entities/UserLogin');
const NewAuthentication = require('../../Domains/authentications/entities/NewAuth');

class AuthLoginUseCase {
  constructor({ authenticationRepository, userRepository, authenticationTokenManager, passwordHash }) {
    this._authenticationRepository = authenticationRepository;
    this._userRepository = userRepository;
    this._authenticationTokenManager = authenticationTokenManager;
    this._passwordHash = passwordHash;
  }

  async execute(useCasePayload) {
    const { username, password } = new UserLogin(useCasePayload);
    
    const { id, role, password: encryptedPassword } = await this._userRepository.getUserCredentialByUsername(username);
    
    await this._passwordHash.comparePassword(password, encryptedPassword);
    
    const accessToken = await this._authenticationTokenManager.createAccessToken({ id, role, username });
    const refreshToken = await this._authenticationTokenManager.createRefreshToken({ id, role, username });
    
    const newAuthentication = new NewAuthentication({
      accessToken,
      refreshToken,
    });
    
    await this._authenticationRepository.addToken(newAuthentication.refreshToken);
    
    return newAuthentication;
  }
}

module.exports = AuthLoginUseCase;
