const { encrypt } = require("./secure.js");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

const path_to_env = path.resolve(__dirname, "../.env");
const env = dotenv.parse(fs.readFileSync(path_to_env));

const { VERSION, AGENT_SECRET_KEY } = env;

const data = JSON.stringify({
  id: "gir-agent-001",
  version: VERSION,
});

const encryptedVersion = encrypt(data, AGENT_SECRET_KEY);
console.log("Encrypted version:", encryptedVersion);

try {
  // Put the encrypted version in the .env file
  const txt = fs.readFileSync(path_to_env, "utf8");

  const newTxt = txt
    .split("\n")
    .map((line) => {
      if (line.startsWith("VERSION_ENC=")) {
        return `VERSION_ENC=${encryptedVersion}`;
      }
      return line;
    })
    .join("\n");

  fs.writeFileSync(path_to_env, newTxt);
} catch (e) {
  console.error("Error while updating .env file:", e);
}
