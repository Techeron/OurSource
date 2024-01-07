import pg from "pg";
import fs from "fs";
const sqlScript = fs.readFileSync("./src/sql/init.sql", "utf-8");

// Client need to use POSTGRES_PASSWORD, POSTGRES_USER, POSTGRES_DB, POSTGRES_ADDR, POSTGRES_PORT env variables
// Using locahost as default can be a problem for container as it will refer as the container where the app is running
// and not where the database is running
const client = new pg.Client({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_ADDR,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
});

export default {
  async connect() {
    try {
      await client.connect();
      console.log("[DB] Connected to PostgreSQL database");
      await client.query(sqlScript);
      console.log("[DB] Initialized database");
    } catch (error) {
      console.error("[DB] Failed to connect to PostgreSQL database:", error);
    }
  },
  async query(query, values) {
    console.log(query);
    return new Promise(async (resolve, reject) => {
      try {
        const result = await client.query(query, values);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  },
  async set(key, value) {
    try {
      const query = "INSERT INTO your_table (key, value) VALUES ($1, $2)";
      await client.query(query, [key, value]);
      console.log(`[DB] Set ${key} to ${value}`);
    } catch (error) {
      console.error("[DB] Failed to set value in PostgreSQL database:", error);
    }
  },
  async get(key) {
    try {
      const query = "SELECT value FROM your_table WHERE key = $1";
      const result = await client.query(query, [key]);
      const value = result.rows[0]?.value;
      console.log(`[DB] Got ${key} as ${value}`);
      return value;
    } catch (error) {
      console.error(
        "[DB] Failed to get value from PostgreSQL database:",
        error
      );
      return null;
    }
  },
};
