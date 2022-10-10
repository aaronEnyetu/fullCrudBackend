const pool = require('../utils/pool');

class List {
  id;
  description;
  user_id;
  completed;

  constructor(row) {
    this.id = row.id;
    this.description = row.description;
    this.user_id = row.user_id;
    this.completed = row.completed;
  }

  static async insertItem({ description, user_id }) {
    const { rows } = await pool.query(
      `
      INSERT INTO lists (description, user_id)
      VALUES ($1, $2)
      RETURNING *
    `,
      [description, user_id]
    );

    return new List(rows[0]);
  }

  static async delete(id) {
    const { rows } = await pool.query(
      `DELETE from lists
            WHERE id = $1
            RETURNING *`,
      [id]
    );
    return new List(rows[0]);
  }
}
module.exports = { List };
