import { config } from "@/lib/config";
import axios from "axios";

// const config = getConfig();

export const axiosPrivate = axios.create({
  baseURL: config.mainServiceURL,
  // headers: {
  //   "Content-Type": "application/json",
  // },
});
