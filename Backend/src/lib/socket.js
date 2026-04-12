import { Server } from "socket.io";

let ioInstance;

export const initSocket = (httpServer) => {
  ioInstance = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  ioInstance.on("connection", (socket) => {
    const userId = socket.handshake.auth?.userId || socket.handshake.query?.userId;
    const role = socket.handshake.auth?.role || socket.handshake.query?.role;

    if (userId) {
      socket.join(`user:${userId}`);
    }

    if (role) {
      socket.join(`role:${role}`);
    }
  });

  return ioInstance;
};

export const getIO = () => ioInstance;

export const emitToUser = (userId, event, payload) => {
  if (!ioInstance || !userId) {
    return;
  }
  ioInstance.to(`user:${userId}`).emit(event, payload);
};

export const emitToRole = (role, event, payload) => {
  if (!ioInstance || !role) {
    return;
  }
  ioInstance.to(`role:${role}`).emit(event, payload);
};
