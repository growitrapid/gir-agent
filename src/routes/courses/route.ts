import { Router } from "express";
import { z } from "zod";
import * as cheerio from "cheerio";
import { NodeHtmlMarkdown } from "node-html-markdown";
import Log from "../../utils/log";
import { COURSERA_COURSE_SCHEMA, COURSERA_COURSE_TYPE, COURSE_PROVIDER_KEYS } from "./courses.types";
import GenerateJSONFromMD from "./ai_agent";
import chalk from "chalk";

// Create a new router.
const router = Router();

// Define the request schema.
const requestSchema = z.object({
  url: z.string(),
  provider: z.enum(COURSE_PROVIDER_KEYS),
});

// Define the routes.
router.post("/scrap", async (req, res) => {
  try {
    // Validate the request.
    const request = requestSchema.parse(req.body);
    const { url, provider } = request;

    console.log("");
    Log.route("POST /scrap").info(
      "Incoming request to scrape courses.\nURL: ",
      url
    );

    // Check if the provider is valid.
    if (!COURSE_PROVIDER_KEYS.includes(provider)) {
      return res.status(400).json({
        error: "Invalid provider.",
      });
    }

    // Fetch the courses.
    Log.route("POST /scrap").info("Fetching the course HTML...");
    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    if (response.status !== 200) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const html = await response.text();
    // // Load the HTML content.
    const $ = cheerio.load(html);
    const $main = $("main");

    // Convert the HTML to markdown.
    Log.route("POST /scrap").info("Converting the HTML to Markdown...");
    const md = NodeHtmlMarkdown.translate(
      $main.html() || "",
      {},
      undefined,
      undefined
    );

    // Generate JSON from the Markdown.
    Log.route("POST /scrap").info("Generating JSON from Markdown...");
    const StringifiedAIScrappedData = await GenerateJSONFromMD(md, process.env.GOOGLE_AI_API_KEY);

    try {
      const AIScrappedData = JSON.parse(StringifiedAIScrappedData) as COURSERA_COURSE_TYPE;
      AIScrappedData.redirectLink = url;

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
      replaceNullValues(AIScrappedData);
  
      // Validate the scraped data.
      const parsedData = COURSERA_COURSE_SCHEMA.parse(AIScrappedData);
  
      // Return the scraped data.
      res.json({
        data: parsedData,
        stringifiedData: StringifiedAIScrappedData,
      });
    } catch (error: any) {
      console.log("");
      Log.route("POST /scrap").error("Failed to parse the scraped data.");
      Log.route("POST /scrap").error(error);
      Log.route("POST /scrap").error(`Markdown data: '${chalk.greenBright(md.slice(0, 400).replaceAll(/\n/g, ""))}...'`);
      Log.route("POST /scrap").error(`Scrapped data: '${chalk.greenBright(StringifiedAIScrappedData.slice(0, 200))}\n...\n${chalk.greenBright(StringifiedAIScrappedData.slice(-100, -1))}'`);
      res.status(400).json({
        error: error.toString(),
        stringifiedData: StringifiedAIScrappedData,
        markdownData: md,
      });
    }
  } catch (error: any) {
    console.log("");
    Log.route("POST /scrap").error(error);
    res.status(400).json({
      error: error.toString(),
    });
  }
});

// Export the router.
export default router;
