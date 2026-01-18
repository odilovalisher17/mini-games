const routes = [];

const route_handler = (req, res) => {
  const route = routes.find(
    (r) => r.url === req.url && r.method === req.method
  );

  if (route) {
    let handler_res = route.handler();

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

export default route_handler;
