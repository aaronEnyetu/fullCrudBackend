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

  static async getAllItems(user_id) {
    const { rows } = await pool.query(
      `
      SELECT * FROM lists
      WHERE user_id = $1
      `,
      [user_id]
    );
    return rows.map((row) => new List(row));
  }
  static async getItemById(id) {
    const { rows } = await pool.query(
      `SELECT * from lists
      WHERE id = $1`,
      [id]
    );
    if (rows.length === 0) {
      return null;
    }
    return new List(rows[0]);
  }
  static async updateItemById(id, newAttributes) {
    const item = await List.getItemById(id);
    if (!item) return null;
    const updatedData = { ...item, ...newAttributes };
    const { rows } = await pool.query(
      `UPDATE lists
      SET description = $1, completed = $2
      WHERE id = $1
      RETURNING *`,
      [id, updatedData.description, updatedData.completed]
    );
    return new List(rows[0]);
  }

  static async delete(id) {
    const item = await List.getItemById(id);
    if (!item) return null;
    const { rows } = await pool.query(
      `
      DELETE FROM lists
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );
    return new List(rows[0]);
  }
}
module.exports = { List };
