import { z } from "zod";

export const ConfigSchema = z.object({
  mainServiceURL: z.string(),
  apiURL: z.string(),
  MainServiceURL: z.string(),
});

export type Config = z.infer<typeof ConfigSchema>;
