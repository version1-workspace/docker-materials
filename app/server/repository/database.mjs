import pg from "pg";

const client = new pg.Client({
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
});

async function connect() {
  await client.connect();
  console.log("Connected to PostgreSQL");
}

export class Database {
  async findAll() {
    const result = await client.query("SELECT * FROM todos");
    return result.rows;
  }

  async find(id) {
    const result = await client.query("SELECT * FROM todos WHERE id = $1", [
      id,
    ]);
    return result.rows[0];
  }

  async create(todo) {
    await client.query("INSERT INTO todos (title) VALUES ($1)", [todo.title]);
  }

  async update(id, todo) {
    await client.query("UPDATE todos SET title = $1 WHERE id = $2", [
      todo.title,
      id,
    ]);

    return this.find(id);
  }

  async delete(id) {
    const todo = await this.find(id);
    await client.query("DELETE FROM todos WHERE id = $1", [id]);
    return todo;
  }
}

connect();
