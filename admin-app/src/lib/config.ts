import { z } from "zod";

const ConfigSchema = z.object({
  mainServiceURL: z.string(),
  encrytedKey: z.string(),
});

type Config = z.infer<typeof ConfigSchema>;

export const getConfig = (): Config => {
  console.log(process.env.NEXT_PUBLIC_MAIN_SERVICE_URL);
  console.log(process.env.NEXT_PUBLIC_ENCRYPTED_KEY);
  return {
    mainServiceURL: process.env.NEXT_PUBLIC_MAIN_SERVICE_URL as string,
    encrytedKey: process.env.NEXT_PUBLIC_ENCRYPTED_KEY as string,
  };
};

export const config = getConfig();
