import express, { Express, Request, Response } from "express";
import cors from "cors";
import Log from "./utils/log";

// Create an express application.
const app: Express = express();

// Configure the express application.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.get("/ping", (req: Request, res: Response) => {
  res.send("pong");
  Log.server("Ping request is served to the ip address: " + req.ip);
});

// Import the routes.
app.use("/courses", require("./routes/courses/route").default);
app.use("/verify", require("./routes/verify/route").default);

export default app;
