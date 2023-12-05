"use client";

import useAxiosPrivate from "./useAxiosPrivate";
import { User } from "@/interfaces/user";
import { config } from "@/lib/config";
import { useQuery, QueryClient } from "react-query";

const useUsers = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = new QueryClient();

  const usersURL = `${config.mainServiceURL}/users`;

  const getUsers = () => {
    return useQuery<User[], Error>(["users"], async () => {
      const response = await axiosPrivate.get(usersURL)
      return response.data;
    }, {
      onSuccess: (data) => {
        queryClient.setQueryData("users", data);
      },
      onError: (error) => {
        throw new Error(`Error getting users: ${error.message}`);
      },
    });
  }

  return {
    getUsers,
  };
}

export default useUsers;
