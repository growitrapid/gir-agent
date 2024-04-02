/**
 * AGENT: is a program that acts on behalf of another program or user.
 * 
 * Entry point of the application.
 */

import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { validateEnv } from "./src/utils/env";

// Clear the console.
console.clear();

// Load environment variables from .env file.
dotenv.config();
// Validate the environment variables.
process.env = validateEnv(process.env);

const app: Express = express();
const port = parseInt(process.env.PORT || '3000');

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});