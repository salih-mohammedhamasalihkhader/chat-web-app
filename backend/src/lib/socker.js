import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);
const userSocketMap = {};

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      const isLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(
        origin,
      );

      if (isLocalhost) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by Socket.IO CORS"));
    },
    credentials: true,
  },
});

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  console.log("یوزەر کۆنێکت بوو", socket.id);

  socket.on("disconnect", () => {
    if (userId) {
      delete userSocketMap[userId];
    }
    console.log("یوزەر داخڵ نەبوو", socket.id);
  });
});

export const getReceiverSocketId = (userId) => userSocketMap[userId];

export { io, app, server };
