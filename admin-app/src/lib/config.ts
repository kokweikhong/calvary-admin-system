import { Config } from "@/interfaces/config";

export const getConfig = (): Config => {
  return {
    mainServiceURL: process.env.NEXT_PUBLIC_MAIN_SERVICE_URL + "/api/v1" || "http://localhost:3000/api",
    apiURL: process.env.NEXT_PUBLIC_MAIN_SERVICE_URL || "http://localhost:3000/api",
    MainServiceURL: process.env.NEXT_PUBLIC_MAIN_SERVICE_URL || "http://localhost:3000/api",
  };
}

export const config = getConfig();
