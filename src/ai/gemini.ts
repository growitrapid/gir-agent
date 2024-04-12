import {
  Content,
  GenerationConfig,
  GenerativeModel,
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
  SafetySetting,
} from "@google/generative-ai";
import log from "../utils/log";
import chalk from "chalk";

export default function getGenAIModel(params?: {
  api_key?: string;
  model?: string;
  systemInstructions?: string;
  generationConfig?: GenerationConfig;
  safetySettings?: SafetySetting[];
}): GenerativeModel {
  log.defaultArg = [chalk.red(`[ERROR]: `)];

  try {
    // Get the api key from the params or the environment variables.
    const API_KEY = params?.api_key || process.env.GOOGLE_AI_API_KEY;

    // Create a new instance of the GoogleGenerativeAI class.
    const genAI = new GoogleGenerativeAI(API_KEY);

    const generationConfig: GenerationConfig = params?.generationConfig || {
      temperature: 0.3,
      topK: 1,
      topP: 1,
      maxOutputTokens: 8192,
    };

    const safetySettings: SafetySetting[] = params?.safetySettings || [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];

    // Get the generative model.
    const model = genAI.getGenerativeModel({
      model: params?.model || "gemini-1.5-pro-latest",
      generationConfig,
      safetySettings,
      // @ts-ignore
      systemInstructions: params?.systemInstructions || "",
    }, {
      apiVersion: "v1beta",
    });

    return model;
  } catch (error: any) {
    throw new Error(error);
  }
}
