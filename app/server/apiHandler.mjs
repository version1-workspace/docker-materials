import { Memory } from "./repository/memory.mjs";
import { Database } from "./repository/database.mjs";
import { ValidationError } from "./repository/error.mjs";

const basePath = "/api/v1";
const apiEndpoint = (path) => basePath + path;

const todoRepository = (function (kind) {
  switch (kind) {
    case "memory":
      return new Memory();
    case "database":
      return new Database();
    default:
      throw new Error(`Unknown repository kind: ${kind}`);
  }
})("memory");

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
    try {
      await todoRepository.create(todo);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({}));
    } catch (e) {
      if (e instanceof ValidationError) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: e.message,
          }),
        );
        return;
      }
      throw e;
    }
  }

  if (req.url === apiEndpoint("/todos") && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(await todoRepository.findAll()));
  }

  if (req.url.match(apiEndpoint("/todos/[0-9]+")) && req.method === "GET") {
    const id = retrieveId(req);
    const todoItem = await todoRepository.find(id);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(todoItem));
  }

  if (
    req.url.match(apiEndpoint("/todos/[0-9]")) &&
    (req.method === "PATCH" || req.method === "PUT")
  ) {
    const id = retrieveId(req);
    const todo = await parseBody(req);
    try {
      const todoItem = await todoRepository.update(id, todo);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(todoItem));
    } catch (e) {
      if (e instanceof ValidationError) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: errorMessage,
          }),
        );
        return;
      }
      throw e;
    }
  }

  if (req.url.match(apiEndpoint("/todos/[0-9]")) && req.method === "DELETE") {
    const id = retrieveId(req);
    const todo = todoRepository.find(id);
    if (!todo) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          message: "Not Found",
        }),
      );
      return;
    }
    await todoRepository.delete(id);

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(todo));
  }
};

const retrieveId = (req) => {
  const matched = req.url.match(/\/todos\/([0-9]+)/);
  return Number(matched[1]);
};
