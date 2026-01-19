import xoCreateRoom from "./services/xoCreateRoom.js";

const routes = [];

const route_handler = async (req, res, rooms) => {
  if (req.method === "POST") {
    req.body = await new Promise((resolve) => {
      let body = "";
      req.on("data", (c) => (body += c));
      req.on("end", () => resolve(JSON.parse(body)));
    });
  }

  const route = routes.find((r) => r.url == req.url && r.method == req.method);

  if (route) {
    let handler_res = JSON.stringify(route.handler(req, rooms));

    res.writeHead(200, {
      "content-type": "text/plain",
      "content-length": handler_res.length,
    });

    return res.end(handler_res);
  }

  res.writeHead(404, {
    "content-type": "text/plain",
    "content-length": 12,
  });
  return res.end("Bad request!");
};

const add_route = (url, method, handler) => {
  routes.push({
    url: url,
    method: method,
    handler: handler,
  });
};

add_route("/api/xo/create-room", "POST", xoCreateRoom);

export { route_handler };
