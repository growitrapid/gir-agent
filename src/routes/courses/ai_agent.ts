import {
  Content,
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai";
import { ExampleJSON, ExampleMD } from "./example";
import log from "../../utils/log";

async function GenerateJSONFromMD(
  md: string,
  API_KEY: string
): Promise<string> {
  try {
    const MODEL_NAME = "gemini-1.0-pro";

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const generationConfig = {
      temperature: 0.3,
      topK: 1,
      topP: 1,
      maxOutputTokens: 8192,
    };

    const safetySettings = [
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

    const contents: Content[] = [
      {
        role: "user",
        parts: [
          {
            text: `You are a function that generates JSON from Markdown in the bellow format.
[FORMAT]: {
  "title": string,
  "description": string,
  "thumbnail": string,
  "instructors": string[],
  "total_enrolled_students": string,
  "rating": string,
  "duration": string,
  "experience": string,
  "reviews": string,
  "what_you_will_learn": string[],
  "tags": string[],
  "avg_salary": string,
  "job_openings": string,
  "guarantee_percentage": string,
  "outcomes": string,
  "series": {
    "title": string,
    "link": string,
    "duration": string,
    "rating": string,
    "internalTags": string[],
    "whatYouWillLearn": string[],
  }[],
}

Some Important Notes:
1. The function should return the generated JSON string only.
2. The function should not have any side effects and strictly follow the input-output format mentioned above.
3. The function will ignore unnecessary parts of the input Markdown as well as line breaks, bold, italic, underline etc.
4. If any of the required fields are missing in the input Markdown, the function should return an empty string ("") or array ([]) for that field.
5. Don't exagerate the input Markdown. Keep it simple and to the point.
`,
          },
        ],
      },
      {
        role: "model",
        parts: [
          { text: "Sure, I can help you with that. Send Markdown content." },
        ],
      },
      // { role: "user", parts: [{ text: ExampleMD }] },
      // { role: "model", parts: [{ text: ExampleJSON }] },
      { role: "user", parts: [{ text: md }] },
    ];

    const result = await model.generateContent({
      contents,
      generationConfig,
      safetySettings,
    });

    const response = result.response;
    console.log(response.candidates);
    
    let data = response.text().trim();
    data = data === "" ? "{}" : data;
    data = data.replace(/^```json/, "").replace(/```$/, "").trim();

    // Trim and remove the ```json from the response if it exists.
    return data;
  } catch (error) {
    log.error("Failed to generate JSON from Markdown.");
    log.error(error);
    return "{}";
  }
}

export default GenerateJSONFromMD;
