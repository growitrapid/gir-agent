import inquirer from "inquirer";

export default function createPrompter(cb?: () => void) {
  inquirer
    .prompt([
      {
        type: "input",
        name: "API_KEY",
        message: "Enter your API key: (Enter for default)",
        required: false,
        default: process.env.GOOGLE_AI_API_KEY,
      },
    ])
    .then((answers) => {
      process.env.GOOGLE_AI_API_KEY = answers.API_KEY;
      if (cb && typeof cb === "function") {
        cb();
      }
    });
}
