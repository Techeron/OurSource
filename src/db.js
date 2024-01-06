import pg from "pg";
const client = new pg.Client({
  user: "dev",
  host: "localhost",
  database: "dev",
  password: "testpass",
  port: 5432,
});

export default {
  async connect() {
    try {
      await client.connect();
      console.log("[DB] Connected to PostgreSQL database");
    } catch (error) {
      console.error("[DB] Failed to connect to PostgreSQL database:", error);
    }
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
