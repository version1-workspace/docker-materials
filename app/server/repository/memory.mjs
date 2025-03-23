import { ValidationError } from "./error.mjs";
const todos = [
  {
    id: 1,
    title: "Learn JavaScript",
  },
  {
    id: 2,
    title: "Learn TypeScript",
  },
  {
    id: 3,
    title: "Learn Docker",
  },
];

export class Memory {
  async create(todo) {
    const errorMessage = validateTodo(todo);
    if (errorMessage) {
      throw new ValidationError(errorMessage);
    }
    todos.push({
      ...todo,
      id: generateId(),
    });
  }

  async findAll() {
    return todos;
  }

  async find(id) {
    return todos.find((todo) => todo.id === id);
  }

  async update(id, todo) {
    const errorMessage = validateTodo(todo);
    if (errorMessage) {
      throw new ValidationError(errorMessage);
    }
    const index = todos.findIndex((todo) => todo.id === id);
    todos[index] = todo;
    return todo;
  }

  async delete(id) {
    const index = todos.findIndex((todo) => todo.id === id);
    const item = todos[index];
    todos.splice(index, 1);

    return item;
  }
}

const generateId = () => {
  if (todos.length === 0) {
    return 1;
  }

  return todos[todos.length - 1].id + 1;
};

const validateTodo = (todo) => {
  if (!todo.title) {
    return "Title is required";
  }

  return;
};
