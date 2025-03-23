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

const basePath = "/api/v1";
const apiEndpoint = (path) => basePath + path;

const validateTodo = (todo) => {
  if (!todo.title) {
    return "Title is required";
  }

  return;
};

const parseBody = (req) => {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("error", (err) => {
      reject(err);
    });
    req.on("end", () => {
      resolve(JSON.parse(body));
    });
  });
};

// Create an HTTP server
export const handler = async (req, res) => {
  // Send the response body
  if (req.url === apiEndpoint("/todos") && req.method === "POST") {
    const todo = await parseBody(req);
    const errorMessage = validateTodo(todo);
    if (errorMessage) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          message: errorMessage,
        }),
      );
      return;
    }
    todos.push({
      ...todo,
      id: todos.length + 1,
    });
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({}));
  }

  if (req.url === apiEndpoint("/todos") && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(todos));
  }

  if (req.url.match(apiEndpoint("/todos/[0-9]+")) && req.method === "GET") {
    const id = retrieveId(req);
    const todoItem = todos.find((todo) => todo.id === id);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(todoItem));
  }

  if (
    req.url.match(apiEndpoint("/todos/[0-9]")) &&
    (req.method === "PATCH" || req.method === "PUT")
  ) {
    const id = retrieveId(req);
    const todo = await parseBody(req);
    const errorMessage = validateTodo(todo);
    if (errorMessage) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          message: errorMessage,
        }),
      );
      return;
    }
    const todoItem = todos.find((todo) => todo.id === id);
    todoItem.title = todo.title;

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(todoItem));
  }

  if (req.url.match(apiEndpoint("/todos/[0-9]")) && req.method === "DELETE") {
    const id = retrieveId(req);
    todos = todos.filter((todo) => todo.id !== id);
    const todoItem = todos.find((todo) => todo.id === id);

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(todoItem));
  }
};

const retrieveId = (req) => {
  const matched = req.url.match(/\/todos\/([0-9]+)/);
  return Number(matched[1]);
};
