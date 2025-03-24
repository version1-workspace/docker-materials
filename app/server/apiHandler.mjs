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
})(process.env.DATASOURCE_TYPE || "memory");

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

function writeHead(res, statusCode) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
  });
}

// Create an HTTP server
export const handler = async (req, res) => {
  if (req.method === "OPTIONS") {
    writeHead(res, 204);
    res.end();
    return;
  }
  // Send the response body
  if (req.url === apiEndpoint("/todos") && req.method === "POST") {
    const todo = await parseBody(req);
    try {
      await todoRepository.create(todo);
      writeHead(res, 200);
      res.end(JSON.stringify({}));
    } catch (e) {
      if (e instanceof ValidationError) {
        writeHead(res, 400);
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
    writeHead(res, 200);
    res.end(JSON.stringify(await todoRepository.findAll()));
  }

  if (req.url.match(apiEndpoint("/todos/[0-9]+")) && req.method === "GET") {
    const id = retrieveId(req);
    const todoItem = await todoRepository.find(id);
    writeHead(res, 200);
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
      writeHead(res, 200);
      res.end(JSON.stringify(todoItem));
    } catch (e) {
      if (e instanceof ValidationError) {
        writeHead(res, 400);
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
      writeHead(res, 404);
      res.end(
        JSON.stringify({
          message: "Not Found",
        }),
      );
      return;
    }
    await todoRepository.delete(id);

    writeHead(res, 200);
    res.end(JSON.stringify(todo));
  }
};

const retrieveId = (req) => {
  const matched = req.url.match(/\/todos\/([0-9]+)/);
  return Number(matched[1]);
};
