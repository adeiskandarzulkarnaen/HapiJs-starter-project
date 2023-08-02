class RegisterUser {
  constructor(payload) {
    this._verifyPayload(payload);
    const { username, role = 'user', password, fullname } = payload;

    this.username = username;
    this.role = role;
    this.password = password;
    this.fullname = fullname;
  }

  _verifyPayload(payload) {
    const { username, role = 'user', password, fullname } = payload;

    if (!username || !password || !fullname) {
      throw new Error('REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof username !== 'string' || typeof role !== 'string' || typeof password !== 'string' || typeof fullname !== 'string') {
      throw new Error('REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    if (username.length > 50 || role.length > 50) {
      throw new Error('REGISTER_USER.USERNAME_LIMIT_CHAR');
    }

    if (!username.match(/^[\w]+$/)) {
      throw new Error('REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER');
    }
  }
}

module.exports = RegisterUser;
