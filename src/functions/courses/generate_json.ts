import { Content, GenerateContentCandidate } from "@google/generative-ai";
import { Log } from "../../utils/log";
import getGenAIModel from "../../ai/gemini";
import coursera from "./examples/coursera";
import chalk from "chalk";

async function GenerateJSONFromMD(md: string): Promise<{
  data: string;
  response: GenerateContentCandidate[] | undefined;
  error?: string;
}> {
  const log = new Log();
  log.defaultArg = [chalk.yellow(`[SCRAPPER]: `)];

  try {
    // Get the model.
    const model = getGenAIModel({
      systemInstructions: "Generate JSON from Markdown.",
    });

    // Define the contents.
    const contents: Content[] = [
      {
        role: "user",
        parts: [{ text: coursera.instructions }],
      },
      {
        role: "model",
        parts: [
          { text: "Sure, I can help you with that. Send Markdown content." },
        ],
      },
      { role: "user", parts: [{ text: coursera.md }] },
      { role: "model", parts: [{ text: coursera.json }] },
      { role: "user", parts: [{ text: md }] },
    ];

    // Generate the content.
    const result = await model.generateContent({ contents });

    const response = result.response;
    const candidates = response.candidates;

    // Trim and remove the ```json from the response if it exists.
    let data = response.text().trim();
    data = data === "" ? "{}" : data;
    data = data
      .replace(/^```json/, "")
      .replace(/```$/, "")
      .trim();

    return {
      data,
      response: candidates,
    };
  } catch (error: any) {
    log.error("Failed to generate JSON from Markdown.");
    log.error(error);
    return {
      data: "{}",
      response: undefined,
      error: error.toString(),
    };
  }
}

export default GenerateJSONFromMD;
