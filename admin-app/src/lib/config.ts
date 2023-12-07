import { z } from "zod";

const ConfigSchema = z.object({
  mainServiceURL: z.string(),
});

type Config = z.infer<typeof ConfigSchema>;

export const getConfig = (): Config => {
  return {
    mainServiceURL: process.env.NEXT_PUBLIC_MAIN_SERVICE_URL as string,
  };
};

export const config = getConfig();
