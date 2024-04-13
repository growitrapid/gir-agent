import type socketio from "socket.io";
import type { DefaultEventsMap } from "socket.io/dist/typed-events";
import { z } from "zod";
import { clearLastLines, Log } from "../../utils/log";
import {
  COURSE_PROVIDER_KEYS,
  COURSE_PROVIDERS_SCHEMA,
} from "../../functions/courses/courses.types";
import chalk from "chalk";
import ParseSingleCourse from "./parser";

// Define the request schema.
export const requestSchema = z.object({
  tag: z.string(),
  data: z.array(
    z.object({
      id: z.string(),
      url: z.string(),
      thumbnail: z.string(),
      provider: z.enum(COURSE_PROVIDER_KEYS),
    })
  ),
});

export const dataSchema = z.object({
  id: z.string(),
  url: z.string(),
  thumbnail: z.string(),
  provider: z.enum(COURSE_PROVIDER_KEYS),
  statusCode: z.enum(["pending", "parsing", "done", "error"]),

  // Optional fields.
  response: COURSE_PROVIDERS_SCHEMA.optional(),
  status: z.string().optional(),
  error: z.string().optional(),
});

export const responseSchema = z.object({
  tag: z.string(),
  status: z.enum(["parsing", "done", "error", "partial_error"]),
  data: z.array(dataSchema).optional(),
  error: z.string().optional(),
  message: z.string().optional(),
});

export type State = {
  socketId: string;
  scrapper: {
    queue: z.infer<typeof dataSchema>[];
    scrapping: z.infer<typeof dataSchema> | null;
    done: z.infer<typeof dataSchema>[];
  };
};

export default function registerSocketRoutes(
  socket: socketio.Socket<
    DefaultEventsMap,
    DefaultEventsMap,
    DefaultEventsMap,
    any
  >
) {
  const log = new Log();
  log.defaultArg = [chalk.yellow(`[SOCKET | ROUTE/COURSE]: `)];

  const state: State = {
    socketId: socket.id,
    scrapper: {
      queue: [],
      scrapping: null,
      done: [],
    },
  };

  socket.on(
    "course:scraper",
    async (raw_data: z.infer<typeof requestSchema>) => {
      // Validate the request.
      const request = requestSchema.safeParse(raw_data);

      if (!request.success) {
        log.error("Invalid request data.", request.error);
        socket.emit("course:scraper", {
          tag: raw_data.tag || "unknown",
          status: "error",
          data: [],
          error: "Invalid request data.",
          message: request.error.message,
        } as z.infer<typeof responseSchema>);
        return;
      }

      const { tag, data } = request.data;

      console.log("");
      log.info(`Received request for tag: ${tag}`);

      // Push all the requests to the queue.
      state.scrapper.queue.push(
        ...data.map<z.infer<typeof dataSchema>>((d) => ({
          id: d.id,
          url: d.url,
          thumbnail: d.thumbnail,
          provider: d.provider,
          statusCode: "pending",
        }))
      );

      let response: z.infer<typeof responseSchema> = {
        tag,
        status: "parsing",
        data: data.map<z.infer<typeof dataSchema>>((d) => ({
          id: d.id,
          url: d.url,
          thumbnail: d.thumbnail,
          provider: d.provider,
          statusCode: "pending",
        })),
        error: undefined,
        message: "",
      };

      function showStatus(
        total: number,
        success: number,
        error: number,
        remaining: number,
        anime?: string
      ) {
        clearLastLines(1);
        log.raw(
          `${chalk.blueBright(`[${anime ? ` ${anime} ` : ""}STATUS]: `)} ` +
            `${chalk.cyanBright("Total:")} ${total}, ` +
            `${chalk.greenBright("Success:")} ${success}, ` +
            `${chalk.redBright("Error:")} ${error}, ` +
            `${chalk.yellowBright("Remaining:")} ${remaining}`
        );
      }

      let loadingInterval: NodeJS.Timeout | null = null;
      function statusInterval(
        total: number,
        success: number,
        error: number,
        remaining: number
      ) {
        if (loadingInterval) clearInterval(loadingInterval);
        loadingInterval = (function () {
          var P = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧"];
          var x = 0;

          return setInterval(() => {
            showStatus(total, success, error, remaining, P[x++]);
            x %= P.length;
          }, 50);
        })();
      }

      // Start the scrapper.
      console.log("");
      while (state.scrapper.queue.length > 0) {
        // Log the status.
        statusInterval(
          data.length,
          state.scrapper.done.filter((d) => d.statusCode === "done").length,
          state.scrapper.done.filter((d) => d.statusCode === "error").length,
          state.scrapper.queue.length
        );

        if (!response.data) response.data = [];
        const current = state.scrapper.queue.shift();
        if (!current) continue;

        // Update State & Response.
        current.statusCode = "parsing";
        state.scrapper.scrapping = current;
        response.data = response.data.map((d) =>
          d.id === current.id ? current : d
        );

        // Emit the current Response.
        socket.emit("course:scraper", response);

        // Parse the course.
        const parsedCourse = await ParseSingleCourse(
          current,
          tag,
          state.scrapper.done.length + 1,
          data.length
        );

        // Push the parsed course to the done list.
        state.scrapper.done.push(parsedCourse);

        // Update the response.
        response.data = response.data.map((d) =>
          d.id === parsedCourse.id ? parsedCourse : d
        );

        // Check if the course was parsed successfully.
        if (parsedCourse.statusCode === "error") {
          response.status = "partial_error";
          response.error =
            parsedCourse.error || "Some courses failed to parse.";
          response.message = "Some courses failed to parse.";
        }

        // Emit the response.
        socket.emit("course:scraper", response);
      }

      // Update the response.
      response.status = "done";

      // Final Log the status.
      if (loadingInterval) clearInterval(loadingInterval);
      showStatus(
        data.length,
        state.scrapper.done.filter((d) => d.statusCode === "done").length,
        state.scrapper.done.filter((d) => d.statusCode === "error").length,
        state.scrapper.queue.length,
        "✔"
      );

      // Final response.
      socket.emit("course:scraper", response);
      log.info("Parsing completed.");

      // Reset the state.
      state.scrapper = {
        queue: [],
        scrapping: null,
        done: [],
      };
    }
  );
}
