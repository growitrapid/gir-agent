import { z } from "zod";
import Log from "./log";

const envSchema = z.object({
  NODE_ENV: z.string().default("development"),
  VERSION: z.string().default("1.0.0"),
  VERSION_ENC: z.string().default("1.0.0"),
  PORT: z.string().default("3000"),
  GOOGLE_AI_API_KEY: z.string(),
});

export type Env = z.infer<typeof envSchema>;

declare global {
  namespace NodeJS {
    interface ProcessEnv extends Env {}
  }
}

// This function will be used to validate the environment variables
export const validateEnv = (env: NodeJS.ProcessEnv): Env => {
  try {
    return envSchema.parse(env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      Log.error("Failed to validate the environment variables.");
      Log.error(error.toString());
      process.exit(1);
    }
    throw error;
  }
};
