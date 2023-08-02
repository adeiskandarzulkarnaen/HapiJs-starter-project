/* istanbul ignore file */
const Jwt = require('@hapi/jwt');

const ServerTestHelper = {
  getAccessToken: async (userId=null, role=null, username=null) => {
    const payload = {
      id: userId ||'user-123',
      role: role || 'user',
      username: username || 'aceng',
    };
    return Jwt.token.generate(payload, process.env.ACCESS_TOKEN_KEY);
  },
};

module.exports = ServerTestHelper;
