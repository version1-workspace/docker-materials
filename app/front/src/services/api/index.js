class Client {
  baseURL = process.env.API_URL || "http://localhost:3000/api/v1";

  async get(path) {
    const response = await fetch(`${this.baseURL}/${path}`);

    return await response.json();
  }

  async post(path, data) {
    return this.mutate(path, { method: "POST", data });
  }

  async put(path, data) {
    return this.mutate(path, { method: "PUT", data });
  }

  async delete(path) {
    return this.mutate(path, { method: "DELETE" });
  }

  async mutate(path, { method, data }) {
    const response = await fetch(`${this.baseURL}/${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data || {}),
    });

    return await response.json();
  }
}

const client = new Client();

export const fetchTodos = () => client.get("todos");
export const createTodo = (data) => client.post("todos", data);
export const updateTodo = (id, data) => client.put(`todos/${id}`, data);
export const deleteTodo = (id) => client.delete(`todos/${id}`);
