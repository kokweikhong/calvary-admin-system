import axios from "axios";
import { config } from "./config";

const axiosResetPassword = axios.create({
  baseURL: config.mainServiceURL + "api/v1",
});

export async function resetPassword(email: string) {
  const response = await axiosResetPassword.post("/auth/reset-password", {
    email,
  });
  return response.data;
}

export async function getEmailFromToken(token: string) {
  const response = await axiosResetPassword.get(
    `/auth/reset-password/${token}`,
  );
  return response.data;
}

export async function updatePassword(token: string, password: string) {
  const response = await axiosResetPassword.put(
    `/auth/reset-password/${token}`,
    {
      password,
    },
  );
  return response.data;
}
