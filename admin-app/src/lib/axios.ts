import { config } from "@/lib/config";
import axios from "axios";


export const axiosPrivate = axios.create({
  baseURL: config.mainServiceURL,
  // baseURL: "http://calvary-main-service"
  // headers: {
  //   "Content-Type": "application/json",
  // },
});
