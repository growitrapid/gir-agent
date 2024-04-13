import * as Cheerio from "cheerio";
import { COURSE_PROVIDER_KEYS } from "./courses.types";
import { Log } from "../../utils/log";
import chalk from "chalk";
import { NodeHtmlMarkdown } from "node-html-markdown";

export default async function scrapCourse({
  provider,
  url,
  noLog = false,
}: {
  provider: (typeof COURSE_PROVIDER_KEYS)[number];
  url: string;
  noLog?: boolean;
}): Promise<string> {
  const log = new Log();
  log.defaultArg = [chalk.yellow(`[SCRAPPER]: `)];
  log.noLog = noLog;

  try {
    // Fetch the courses.
    log.raw("Fetching the course HTML...");
    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    if (response.status !== 200) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    const html = await response.text();

    // Load the HTML content.
    log.raw("Loading the HTML content...");
    const $ = Cheerio.load(html);
    const $main = ["coursera"].includes(provider) ? $("main") : $("body");

    // Convert the HTML to markdown.
    log.raw("Converting the HTML to Markdown...");
    const md = NodeHtmlMarkdown.translate(
      $main.html() || "",
      {},
      undefined,
      undefined
    );

    return md;
  } catch (error: any) {
    log.error("Failed to scrape the course content.");
    log.error(error);
    return "";
  }
}
