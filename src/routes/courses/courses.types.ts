import { z } from "zod";

export const COURSE_PROVIDERS = {
  coursera: {
    name: "Coursera",
    url: "https://www.coursera.org",
  },
  udemy: {
    name: "Udemy",
    url: "https://www.udemy.com",
  },
  edx: {
    name: "edX",
    url: "https://www.edx.org",
  },
  khanacademy: {
    name: "Khan Academy",
    url: "https://www.khanacademy.org",
  },
  others: {
    name: "Others",
    url: "",
  },
  selfhosted: {
    name: "Self-hosted",
    url: "",
  },
} as const;

export const COURSE_PROVIDER_KEYS = ["coursera", "udemy", "edx", "khanacademy", "others", "selfhosted"] as const;

export const COURSERA_COURSE_SCHEMA = z.object({
  title: z.string(),
  description: z.string(),
  thumbnail: z.string(),
  instructors: z.array(z.string()),
  total_enrolled_students: z.string(),
  rating: z.string(),
  duration: z.string(),
  experience: z.string(),
  reviews: z.string(),
  what_you_will_learn: z.array(z.string()),
  tags: z.array(z.string()),
  avg_salary: z.string(),
  job_openings: z.string(),
  guarantee_percentage: z.string(),
  outcomes: z.string(),
  series: z.array(
    z.object({
      title: z.string(),
      link: z.string(),
      duration: z.string(),
      rating: z.string(),
      internalTags: z.array(z.string()),
      whatYouWillLearn: z.array(z.string()),
    })
  ),
  redirectLink: z.string(),
});
export type COURSERA_COURSE_TYPE = z.infer<typeof COURSERA_COURSE_SCHEMA>;
