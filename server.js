import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_DIR = path.join(__dirname, "/public");
const MIME_TYPES = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".ico": "image/x-icon",
  ".png": "image/png",
  ".jpg": "image/jpeg",
};

const server = http.createServer((req, res) => {
  console.log(req.method, req.url);

  let fullPath = path.join(PUBLIC_DIR, req.url);
  let ext = path.extname(fullPath);

  if (!ext) {
    fullPath = path.join(PUBLIC_DIR, "index.html");
    ext = ".html";
  }
  const contentType = MIME_TYPES[ext] || "application/octet-stream";

  fs.readFile(fullPath, (err, data) => {
    if (err) {
      res.writeHead(404, {
        "content-type": contentType,
        "content-length": err.message.length,
      });

      return res.end(err.message);
    }

    res.writeHead(200, {
      "content-type": contentType,
      "content-length": data.length,
    });

    res.end(data);
  });
});

server.listen(3333, () => {
  console.log("Server is listening on port 33333!");
});
