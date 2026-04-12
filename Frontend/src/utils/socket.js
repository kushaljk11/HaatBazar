import { io } from "socket.io-client";

let socketInstance;

export const connectSocket = ({ userId, role }) => {
  if (!userId || !role) {
    return null;
  }

  if (!socketInstance) {
    socketInstance = io("http://localhost:5000", {
      transports: ["websocket"],
      auth: { userId, role },
    });
  }

  return socketInstance;
};

export const getSocket = () => socketInstance;
