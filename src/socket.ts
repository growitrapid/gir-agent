import { Server } from "http";
import * as socketio from "socket.io";
import log from "./utils/log";
import registerCourseSocketRoutes from "./socket_roues/courses";

export default function createSocketServer(server: Server) {
  const io = new socketio.Server(server, {
    cors: {
      origin: "*",
    },
  });
  log.socket().info("Socket server instance is created.");
  log.socket().info("Socket server is listening for connections.");
  log
    .socket()
    .info(`Please connect to the url: http://localhost:${process.env.PORT}`);

  let isSocketConnected = false;

  io.on("connection", (socket) => {
    if (isSocketConnected) {
      socket.disconnect();
      return;
    }
    isSocketConnected = true;
    log.socket().info(`The client is connected. Socket id: ${socket.id}`);

    socket.on("verify", (data) => {
      socket.emit("verify", process.env.VERSION_ENC);
    });

    socket.on("disconnect", () => {
      isSocketConnected = false;
      log.socket().info(`The client is disconnected. Socket id: ${socket.id}`);
    });

    // Register all the socket routes.
    registerCourseSocketRoutes(socket);
  });
}
