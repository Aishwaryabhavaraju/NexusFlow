let ioInstance = null;

const initSocket = (server) => {
  const { Server } = require("socket.io");
  ioInstance = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "POST"]
    }
  });

  ioInstance.on("connection", (socket) => {
    console.log(`Socket.IO client connected: ${socket.id}`);

    socket.on("disconnect", () => {
      console.log(`Socket.IO client disconnected: ${socket.id}`);
    });
  });

  return ioInstance;
};

const getIO = () => ioInstance;

const emitTelemetry = (event, data) => {
  if (ioInstance) {
    ioInstance.emit(event, data);
  }
};

module.exports = {
  initSocket,
  getIO,
  emitTelemetry
};
