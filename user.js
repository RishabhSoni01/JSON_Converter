const { Pool } = require('pg');
const path = require('path');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

class User {
  constructor() {
    this.tableName = 'users';
  }

  // Function to create the users table in the database
  async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS ${this.tableName} (
        id SERIAL PRIMARY KEY,
        name JSONB NOT NULL,
        age INT NOT NULL,
        address JSONB NOT NULL,
        gender VARCHAR(10) NOT NULL
      );
`;

    await pool.query(query);
  }

  // Function to insert data into the users table
  async insertData(users) {
    const query = `
      INSERT INTO ${this.tableName} (name, age, address, gender)
      VALUES ($1, $2, $3, $4);
    `;

    for (const user of users) {
      try {
        await pool.query(query, [user.name, user.age, user.address, user.gender]);
      } catch (error) {
        console.error('Error inserting data:', error);
      }
    }
  }
}

module.exports = User;