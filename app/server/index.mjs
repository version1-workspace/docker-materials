import http from "http";
import { handler as apiHandler } from "./apiHandler.mjs";
import { readFile } from "fs/promises";

const basePath = "/api/v1";

const server = http.createServer(async (req, res) => {
  try {
    // TODO 管理用のトップページ
    if (req.url === "/" && req.method === "GET") {
      const buf = await readFile("./public/index.html");
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(buf.toString());
      console.log(req.method, req.url, res.statusCode);
      return;
    }

    // js, css などのアセットファイル用エンドポイント
    if (
      (req.url.endsWith(".css") || req.url.endsWith(".js")) &&
      req.method === "GET"
    ) {
      try {
        const buf = await readFile("./public/" + req.url);
        if (req.url.endsWith(".css")) {
          res.writeHead(200, { "Content-Type": "text/css" });
        }

        if (req.url.endsWith(".js")) {
          res.writeHead(200, { "Content-Type": "application/javascript" });
        }
        res.end(buf.toString());
      } catch (e) {
        console.log(e);
        res.writeHead(404, { "Content-Type": "text/html" });
        res.end("Not Found");
      }
      console.log(req.method, req.url, res.statusCode);
      return;
    }

    // api/v1 以下のエンドポイント
    if (req.url.startsWith(basePath)) {
      await apiHandler(req, res);
      console.log(req.method, req.url, res.statusCode);
      return;
    }

    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Not Found" }));
    console.log(req.method, req.url, res.statusCode);
  } catch (e) {
    console.error(e);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Internal Server Error" }));
  }
});

// The server listens on port 3000
server.listen(3000, () => {
  console.log("Server listening on port 3000");
});
