import chalk from "chalk";
import {
  COURSERA_COURSE_SCHEMA,
  COURSE_PROVIDERS_TYPE,
  COURSE_PROVIDER_KEYS,
} from "./courses.types";
import { Log } from "../../utils/log";
import scrapCourse from "./scrapper";
import GenerateJSONFromMD from "./generate_json";
import { FinishReason, SafetyRating } from "@google/generative-ai";

export default async function getJSONData({
  url,
  provider,
}: {
  url: string;
  provider: (typeof COURSE_PROVIDER_KEYS)[number];
}): Promise<
  | {
      data: COURSE_PROVIDERS_TYPE[typeof provider];
      response: {
        finishReason: FinishReason | "Unknown";
        safetyRatings: SafetyRating[];
      };
    }
  | {
      error: string;
      stringifiedData: string;
      markdownData: string;
    }
> {
  const log = new Log();
  log.defaultArg = [chalk.yellow(`[SCRAPPER]: `)];

  try {
    // Get the course content.
    const rawData = await scrapCourse({ provider, url });

    // Generate JSON from the Markdown.
    log.info("Generating JSON from Markdown...");
    const generatedJSONData = await GenerateJSONFromMD(rawData);
    log.info("JSON data generated stopped.");
    log.info(
      `Content Generation stopped reason being: ${
        generatedJSONData.response
          ? generatedJSONData.response[0].finishReason
          : "Unknown"
      }`
    );

    if (generatedJSONData.error) {
      log.error("Failed to generate JSON from Markdown.");
      log.error(generatedJSONData.error);
      return {
        error: generatedJSONData.error,
        stringifiedData: generatedJSONData.data,
        markdownData: rawData,
      };
    } else if (generatedJSONData.data === "{}") {
      log.error("Failed to generate JSON from Markdown.");
      log.error("Empty JSON data generated.");
      return {
        error: "Empty JSON data generated.",
        stringifiedData: generatedJSONData.data,
        markdownData: rawData,
      };
    } else if (generatedJSONData.response) {
      log.info("Success in generating JSON from Markdown.");
    }

    const data = JSON.parse(
      generatedJSONData.data
    ) as COURSE_PROVIDERS_TYPE[typeof provider];
    data.redirectLink = url;

    // Replace ann null values with empty strings.
    const replaceNullValues = (obj: any) => {
      for (const key in obj) {
        if (obj[key] === null) {
          obj[key] = "";
        } else if (typeof obj[key] === "object") {
          replaceNullValues(obj[key]);
        }
      }
    };
    replaceNullValues(data);

    // Validate the scraped data.
    const parsedData = COURSERA_COURSE_SCHEMA.parse(data);

    return {
      data: parsedData,
      response: {
        finishReason: generatedJSONData.response
          ? generatedJSONData.response[0].finishReason ?? "Unknown"
          : "Unknown",
        safetyRatings: generatedJSONData.response
          ? generatedJSONData.response[0].safetyRatings ?? []
          : [],
      },
    };
  } catch (error: any) {
    log.error("Failed to scrape the course content.");
    log.error(error);
    return {
      error: error.toString(),
      stringifiedData: "{}",
      markdownData: "",
    };
  }
}
