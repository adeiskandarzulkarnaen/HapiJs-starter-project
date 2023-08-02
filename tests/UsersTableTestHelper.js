/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const UsersTableTestHelper = {
  async addUser({ id='user-123', role='user', username='aceng', password='secret', fullname='Aceng Fikri' }) {
    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4, $5)',
      values: [id, role, username, password, fullname],
    };
    
    await pool.query(query);
  },

  async findUserById(id) {
    const query = {
      text: 'SELECT * FROM users WHERE id = $1',
      values: [id],
    };
    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM users WHERE 1=1');
  },
};

module.exports = UsersTableTestHelper;
