"use client";

import { JWTPayload } from "@/interfaces/auth";
import { config } from "@/lib/config";
import axios from "axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const { auth, setAuth } = useAuth();
  const url = config.mainServiceURL + "/api/v1/auth/refresh-token";

  const refreshToken = async (): Promise<JWTPayload | undefined> => {
    if (!auth) {
      return;
    }
    const payload = {
      username: auth.user.username,
      refreshToken: auth.refreshToken.token,
    };

    try {
      const response = await axios.post<JWTPayload>(url, payload);
      const authResponse = response.data;
      setAuth({ ...auth, accessToken: authResponse });
      return authResponse;
    } catch (error) {
      throw new Error(`Error refreshing token: ${error}`);
    }
  };

  return { refreshToken };
};

export default useRefreshToken;
