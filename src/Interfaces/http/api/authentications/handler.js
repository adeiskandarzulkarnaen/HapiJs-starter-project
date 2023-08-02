const AuthLoginUseCase = require('../../../../Applications/use_case/AuthLoginUseCase');
const AuthLogoutUseCase = require('../../../../Applications/use_case/AuthLogoutUseCase');
const AuthUpdateUseCase = require('../../../../Applications/use_case/AuthUpdateUseCase');

class AuthenticationsHandler {
  constructor(container) {
    this._container = container;
    
    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
    this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
    this.deleteAuthenticationHandler = this.deleteAuthenticationHandler.bind(this);
  }
  
  async postAuthenticationHandler(request, h) {
    const authLoginUseCase = this._container.getInstance(AuthLoginUseCase.name);
    const { accessToken, refreshToken } = await authLoginUseCase.execute(request.payload);
    
    const response = h.response({
      status: 'success',
      data: {
        accessToken,
        refreshToken,
      },
    });
    response.code(201);
    return response;
  }
  
  async putAuthenticationHandler(request) {
    const authUpdateUseCase = this._container.getInstance(AuthUpdateUseCase.name);
    const accessToken = await authUpdateUseCase.execute(request.payload);
    
    return {
      status: 'success',
      data: {
        accessToken,
      },
    };
  }
  
  async deleteAuthenticationHandler(request) {
    const authLogoutUseCase = this._container.getInstance(AuthLogoutUseCase.name);
    await authLogoutUseCase.execute(request.payload);
    
    return {
      status: 'success',
    };
  }
}

module.exports = AuthenticationsHandler;
