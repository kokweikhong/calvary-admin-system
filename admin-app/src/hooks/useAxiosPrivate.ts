"use client";

import { axiosPrivate } from "@/queries/axios";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";

const useAxiosPrivate = () => {
  const { refreshToken } = useRefreshToken()
  const { auth } = useAuth();

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${auth?.accessToken.token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error?.config;
        if (error?.response?.status === 401 && !originalRequest.sent) {
          originalRequest.sent = true;

          const newToken = await refreshToken();

          console.log("newToken", newToken);

          originalRequest.headers["Authorization"] = `Bearer ${newToken?.token}`;

          return axiosPrivate(originalRequest);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [auth, refreshToken]);

  return axiosPrivate;
}

export default useAxiosPrivate;


