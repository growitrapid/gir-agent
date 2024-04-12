import { Router } from "express";
import { z } from "zod";
import Log from "../../utils/log";
import { COURSE_PROVIDER_KEYS } from "../../functions/courses/courses.types";
import getJSONData from "../../functions/courses";

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

    const data = await getJSONData({ provider, url });

    if ("error" in data) {
      return res.status(400).json({
        error: data.error,
        stringifiedData: data.stringifiedData,
        markdownData: data.markdownData,
      });
    }

    res.status(200).json(data);
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
