import { Server as IOServer } from "socket.io";
import type { NextApiRequest, NextApiResponse } from "next";
import type { Server as HTTPServer } from "http";
import type { Socket as NetSocket } from "net";

interface SocketServer extends HTTPServer {
  io?: IOServer;
}

interface SocketWithIO extends NetSocket {
  server: SocketServer;
}

interface ResWithSocket extends NextApiResponse {
  socket: SocketWithIO;
}

export default function handler(req: NextApiRequest, res: ResWithSocket) {
  if (!res.socket.server.io) {
    console.log("🔌 Starting Socket.io server...");

    const io = new IOServer(res.socket.server as any, {
      path: "/api/socketio",
      cors: { origin: "*" },
    });

    io.on("connection", (socket) => {
      console.log("📱 A client connected:", socket.id);

      socket.on("remote-command", (data) => {
        io.emit("remote-command", data);
      });

      socket.on("slide-update", (data) => {
        io.emit("slide-update", data);
      });

      socket.on("disconnect", () => {
        console.log("❌ A client disconnected:", socket.id);
      });
    });

    res.socket.server.io = io;
  }

  res.end();
}
