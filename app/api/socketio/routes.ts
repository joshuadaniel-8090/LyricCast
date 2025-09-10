// auth.api.socket.io.routes.ts
import { NextApiRequest, NextApiResponse } from "next";
import { Server as SocketIOServer } from "socket.io";

// Extend Next.js socket type to avoid TS errors
interface NextApiResponseWithSocket extends NextApiResponse {
  socket: any; // use any to fix TypeScript complaints
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponseWithSocket
) {
  if (!res.socket.server.io) {
    console.log("Initializing Socket.IO server...");

    const io = new SocketIOServer(res.socket.server, {
      path: "/api/socketio",
      cors: {
        origin: "*", // adjust for production
        methods: ["GET", "POST"],
      },
    });

    // Attach to socket.server to avoid reinitialization
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log("✅ Socket connected:", socket.id);

      // Forward remote commands to all other clients
      socket.on("remote-command", (command: string) => {
        socket.broadcast.emit("remote-command", command);
      });

      // Forward slide updates to all other clients
      socket.on("slide-update", (slideData: any) => {
        socket.broadcast.emit("slide-update", slideData);
      });

      socket.on("disconnect", () => {
        console.log("❌ Socket disconnected:", socket.id);
      });
    });
  }

  res.end();
}
