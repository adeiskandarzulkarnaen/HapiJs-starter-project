const InvariantError = require('../../Commons/exceptions/InvariantError');
const RegisteredUser = require('../../Domains/users/entities/RegisteredUser');
const UserRepository = require('../../Domains/users/UserRepository');

class UserRepositoryPostgres extends UserRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async verifyAvailableUsername(username) {
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username],
    };
    
    const result = await this._pool.query(query);
    
    if (result.rowCount) {
      throw new InvariantError('username telah digunakan');
    }
  }

  async addUser(registerUser) {
    const { username, role, password, fullname } = registerUser;
    const id = `user-${this._idGenerator()}`;
    
    const query = {
      text: `INSERT INTO users VALUES($1, $2, $3, $4, $5) RETURNING id, username, fullname`,
      values: [id, role, username, password, fullname],
    };
    
    const result = await this._pool.query(query);
    
    return new RegisteredUser({ ...result.rows[0] });
  }

  async getUserCredentialByUsername(username) {
    const query = {
      text: 'SELECT id, role, password FROM users WHERE username = $1',
      values: [username],
    };
    
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('username tidak tersedia');
    };
    
    return result.rows[0];
  }
}

module.exports = UserRepositoryPostgres;
