import { z } from "zod";
import { dataSchema, requestSchema, responseSchema } from ".";
import chalk from "chalk";
import { Log } from "../../utils/log";
import getJSONData from "../../functions/courses";

export default async function ParseSingleCourse(
  req: z.infer<typeof requestSchema>["data"][number],
  tag: string,
  index: number,
  total: number
): Promise<z.infer<typeof dataSchema>> {
  const log = new Log();
  log.defaultArg = [chalk.yellow(`[SOCKET | ROUTE/COURSE]: `)];

  const provider = req.provider;
  const url = req.url;

  try {
    const data = await getJSONData({
      provider,
      url,
      thumbnail: req.thumbnail,
      noLog: true,
    });

    if ("error" in data) {
      return {
        id: req.id,
        url: req.url,
        thumbnail: req.thumbnail,
        provider: req.provider,
        statusCode: "error",
        error: data.error,
        status: "error",
      };
    }

    const courseData = data.data;

    return {
      id: req.id,
      url: req.url,
      thumbnail: req.thumbnail,
      provider: req.provider,
      statusCode: "done",
      response: courseData,
      status: "done",
    };
  } catch (error: any) {
    return {
      id: req.id,
      url: req.url,
      thumbnail: req.thumbnail,
      provider: req.provider,
      statusCode: "error",
      error: error.toString(),
      status: "error",
    };
  }
}
