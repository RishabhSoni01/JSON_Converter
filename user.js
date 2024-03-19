// user.js

const { Pool } = require('pg');

class User {
  constructor() {
    this.pool = new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
    });
  }

  async createTable() {
    try {
      const client = await this.pool.connect();
      const query = `
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name JSONB NOT NULL,
          age INTEGER NOT NULL,
          address JSONB NULL,
          additional_info JSONB NULL
        )
      `;
      await client.query(query);
      console.log('Table created successfully');
    } catch (error) {
      console.error('Error creating table:', error);
    } finally {
      await this.pool.end();
    }
  }

  async insertData(users) {
    try {
      const client = await this.pool.connect();
      for (const user of users) {
        const query = {
          text: `
            INSERT INTO users (name, age, address, additional_info)
            VALUES ($1, $2, $3, $4)
          `,
          values: [user.name, user.age, user.address, user.additional_info],
        };
        await client.query(query);
      }
      console.log('Data inserted successfully');
    } catch (error) {
      console.error('Error inserting data:', error);
    } finally {
      await this.pool.end();
    }
  }
}

module.exports = User;