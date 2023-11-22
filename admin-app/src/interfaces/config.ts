type Config = {
  MainServiceURL: string;
};

export const config: Config = {
  MainServiceURL: process.env.NEXT_PUBLIC_MAIN_SERVICE_URL || "",
};
