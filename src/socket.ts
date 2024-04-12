import { Server } from "http";
import * as socketio from "socket.io";
import log from "./utils/log";

export default function createSocketServer(server: Server) {
  const io = new socketio.Server(server);
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
      log.socket().info("Verifying the client version compatibility.");
      socket.emit("verify", process.env.VERSION);
    });

    socket.on("disconnect", () => {
      isSocketConnected = false;
      log.socket().info(`The client is disconnected. Socket id: ${socket.id}`);
    });
  });
}
