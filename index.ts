/**
 * AGENT: is a program that acts on behalf of another program or user.
 *
 * Entry point of the application.
 */

import dotenv from "dotenv";
import http from "http";

// Import the Sea module if the application is running in the Sea environment.
// Otherwise, import the Node.js module.
// import { isSea, getAsset } from "node:sea";
import { validateEnv } from "./src/utils/env";
import log from "./src/utils/log";
import app from "./src/main";
import createSocketServer from "./src/socket";

// Clear the console.
console.clear();
// Print the greeting message.
log.greeting();
log.info("Starting the application...");

// if (isSea()) {
//   log.success("Running in Sea environment.");
//   // Load environment variables from the asset.
//   const asset = getAsset(".env", "utf8");
//   if (asset === null) {
//     log.error("Failed to load the environment variables.");
//     process.exit(1);
//   } else {
//     const config = dotenv.parse(asset);
//     process.env = { ...process.env, ...config };
//     log.success(
//       `${
//         Object.keys(config).length
//       } Environment variables are loaded successfully.`
//     );
//   }
// } else
{
  log.error("Running in non-Sea environment.");
  // Load environment variables from .env file.
  const config = dotenv.config();
  if (config.error) {
    log.error("Failed to load the environment variables.");
    process.exit(1);
  } else {
    log.success(
      `${
        Object.keys(config.parsed ?? {}).length
      } Environment variables are loaded successfully.`
    );
  }
}

// Validate the environment variables.
process.env = validateEnv(process.env);

// Start the server.
const port = parseInt(process.env.PORT || "3000");
const server = http.createServer(app);
createSocketServer(server);
server.listen(port, () => {
  log.server(`Server is running at http://localhost:${port}`);
});
