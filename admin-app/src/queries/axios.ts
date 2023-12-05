import axios from "axios";
import { getConfig } from "@/lib/config";

const config = getConfig();

export const axiosPrivate = axios.create({
  baseURL: config.apiURL + "/api/v1",
  // headers: {
  //   "Content-Type": "application/json",
  // },
});
