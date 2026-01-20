import http from "http";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";
import { route_handler } from "./api/api_router.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_DIR = path.join(__dirname, "/public");
const API_DIR = path.join(__dirname, "/api");
const MIME_TYPES = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".ico": "image/x-icon",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
};

const rooms = {
  xo: [],
};

const server = http.createServer((req, res) => {
  console.log(req.method, req.url);

  if (req.url.startsWith("/api")) {
    var fullPath = path.join(API_DIR, req.url);
    var ext = path.extname(fullPath);

    return route_handler(req, res, rooms);
  } else {
    var fullPath = path.join(PUBLIC_DIR, req.url);
    var ext = path.extname(fullPath);

    if (!ext) {
      fullPath = path.join(PUBLIC_DIR, "index.html");
      ext = ".html";
    }
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

// ===========================================
// WEBSOCKET PROTOCOL IMPLEMENTATION
// ===========================================

// WebSocket "handshake" - upgrades HTTP to WebSocket
function handleWebSocketUpgrade(req, socket) {
  // Client sends a special "Sec-WebSocket-Key" header
  const key = req.headers["sec-websocket-key"];

  // Magic string defined by WebSocket protocol (RFC 6455)
  const magicString = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";

  // Hash the key + magic string with SHA1, encode as base64
  const acceptKey = crypto
    .createHash("sha1")
    .update(key + magicString)
    .digest("base64");

  // Send HTTP upgrade response
  const headers = [
    "HTTP/1.1 101 Switching Protocols",
    "Upgrade: websocket",
    "Connection: Upgrade",
    `Sec-WebSocket-Accept: ${acceptKey}`,
    "",
    "",
  ].join("\r\n");

  socket.write(headers);

  return socket;
}

// Parse incoming WebSocket frame
function parseFrame(buffer) {
  // WebSocket frame structure (simplified):
  // Byte 0: FIN bit + opcode
  // Byte 1: MASK bit + payload length
  // Bytes 2-5: Masking key (if MASK=1)
  // Remaining: Payload data

  const firstByte = buffer[0];
  const secondByte = buffer[1];

  // Check if final frame (FIN bit)
  const isFinal = (firstByte & 0b10000000) !== 0;

  // Opcode tells us frame type
  const opcode = firstByte & 0b00001111;
  // 0x1 = text, 0x2 = binary, 0x8 = close, 0x9 = ping, 0xA = pong

  // Is data masked? (client->server must be masked)
  const isMasked = (secondByte & 0b10000000) !== 0;

  // Get payload length
  let payloadLength = secondByte & 0b01111111;
  let offset = 2;

  // Extended payload length (for larger messages)
  if (payloadLength === 126) {
    payloadLength = buffer.readUInt16BE(2);
    offset = 4;
  } else if (payloadLength === 127) {
    payloadLength = buffer.readBigUInt64BE(2);
    offset = 10;
  }

  // Get masking key (4 bytes)
  let maskingKey = null;
  if (isMasked) {
    maskingKey = buffer.slice(offset, offset + 4);
    offset += 4;
  }

  // Get payload data
  let payload = buffer.slice(offset, offset + payloadLength);

  // Unmask the data (XOR with masking key)
  if (isMasked && maskingKey) {
    for (let i = 0; i < payload.length; i++) {
      payload[i] = payload[i] ^ maskingKey[i % 4];
    }
  }

  return {
    opcode,
    payload: payload.toString("utf8"),
    isFinal,
  };
}

// Create WebSocket frame to send to client
function createFrame(data) {
  const payload = Buffer.from(data);
  const payloadLength = payload.length;

  let frame;

  // Simple case: payload < 126 bytes
  if (payloadLength < 126) {
    frame = Buffer.allocUnsafe(2 + payloadLength);
    frame[0] = 0b10000001; // FIN=1, opcode=0x1 (text)
    frame[1] = payloadLength; // No mask, length
    payload.copy(frame, 2);
  }
  // Medium case: 126 <= payload < 65536
  else if (payloadLength < 65536) {
    frame = Buffer.allocUnsafe(4 + payloadLength);
    frame[0] = 0b10000001;
    frame[1] = 126; // Length indicator
    frame.writeUInt16BE(payloadLength, 2);
    payload.copy(frame, 4);
  }
  // Large case: payload >= 65536
  else {
    frame = Buffer.allocUnsafe(10 + payloadLength);
    frame[0] = 0b10000001;
    frame[1] = 127;
    frame.writeBigUInt64BE(BigInt(payloadLength), 2);
    payload.copy(frame, 10);
  }

  return frame;
}

// ===================================== Web socket ============================
server.on("upgrade", (req, socket) => {
  console.log("📡 WebSocket upgrade request");

  // Perform WebSocket handshake
  handleWebSocketUpgrade(req, socket);
  console.log("✅ WebSocket connected");

  let buffer = Buffer.alloc(0);

  // Handle incoming data
  socket.on("data", (chunk) => {
    // Accumulate chunks (messages might arrive in parts)
    buffer = Buffer.concat([buffer, chunk]);

    try {
      // Try to parse frame
      const frame = parseFrame(buffer);

      // Handle close frame
      if (frame.opcode === 0x8) {
        console.log("🔌 Client closing connection");
        socket.end();
        return;
      }

      // Handle text frame
      if (frame.opcode === 0x1) {
        // Parse JSON message
        const message = JSON.parse(frame.payload);
        console.log("📨 Received:", message);

        // Route message based on type
        handleMessage(socket, message);

        // Clear buffer after successful parse
        buffer = Buffer.alloc(0);
      }
    } catch (err) {
      // Frame incomplete, wait for more data
      // Or parse error - in production, handle this better
    }
  });

  // Handle disconnect
  socket.on("end", () => {
    console.log("❌ Client disconnected");

    // if (currentRoom) {
    //   const room = rooms.get(currentRoom);
    //   if (room) {
    //     room.removePlayer(socket);
    //     if (room.players.length === 0) {
    //       rooms.delete(currentRoom);
    //     } else {
    //       room.broadcast({ type: "player_left", state: room.getState() });
    //     }
    //   }
    // }
  });

  socket.on("error", (err) => {
    console.log("⚠️ Socket error:", err.message);
  });

  // Message handler
  function handleMessage(socket, msg) {
    try {
      switch (msg.type) {
        // case "xo_create_room": {
        //   const roomId = Math.random().toString(36).substring(7);
        //   rooms.xo.push({
        //     room_id: roomId,
        //     players: [
        //       {
        //         username: msg.username,
        //       },
        //     ],
        //     isStarted: false,
        //     turn: null,
        //     winner: undefined,
        //     board: Array.from({ length: 9 }),
        //   });

        //   const response = createFrame(
        //     JSON.stringify({
        //       type: "create_room",
        //       room_id: roomId,
        //     }),
        //   );
        //   socket.write(response);
        //   break;
        // }

        case "xo_join_room": {
          const room = rooms.xo.find((r) => r.room_id === msg.room_id);

          if (!room) {
            socket.write(
              createFrame(
                JSON.stringify({
                  type: "xo_join_room",
                  message: "Room not found!",
                })
              )
            );
            break;
          }

          if (room.players.length >= 2) {
            socket.write(
              createFrame(
                JSON.stringify({
                  type: "xo_join_room",
                  message: "Rooom is full!",
                })
              )
            );
            break;
          }

          room.players.push({ username: msg.username });

          if (room.players.length === 2 && room.isStarted === false) {
            room.isStarted = true;
            room.turn = 0;
          }

          socket.write(
            createFrame(
              JSON.stringify({
                type: "xo_join_room",
                state: room,
              })
            )
          );
          break;
        }

        case "xo_room_state": {
          const room = rooms.xo.find((r) => r.room_id === msg.room_id);

          const response = createFrame(
            JSON.stringify({
              type: "room_state",
              state: room,
            })
          );

          socket.write(response);
          break;
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
});

server.listen(3333, () => {
  console.log("Server is listening on port 3333!");
});
