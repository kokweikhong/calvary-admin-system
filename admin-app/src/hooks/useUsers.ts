"use client";

import { User } from "@/interfaces/user";
import { config } from "@/lib/config";
import { QueryClient, useMutation, useQuery } from "react-query";
import useAxiosPrivate from "./useAxiosPrivate";

const useUsers = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = new QueryClient();

  const usersURL = `${config.mainServiceURL}/users`;

  const useGetUsers = () => {
    return useQuery<User[], Error>(
      ["users"],
      async () => {
        const response = await axiosPrivate.get(usersURL);
        return response.data;
      },
      {
        onSuccess: (data) => {
          queryClient.setQueryData("users", data);
        },
        onError: (error) => {
          throw new Error(`Error getting users: ${error.message}`);
        },
      }
    );
  };

  const useGetUser = (id: string) => {
    return useQuery<User, Error>(
      ["user", id],
      async () => {
        const response = await axiosPrivate.get(`${usersURL}/${id}`);
        return response.data;
      },
      {
        onSuccess: (data) => {
          queryClient.setQueryData(["user", id], data);
        },
        onError: (error) => {
          throw new Error(`Error getting user: ${error.message}`);
        },
      }
    );
  };

  const useCreateUser = () => {
    return useMutation(
      async (data: User) => {
        const response = await axiosPrivate.post(usersURL, data);
        return response.data;
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries("users");
        },
        onError: (error) => {
          throw new Error(`Error creating user: ${error}`);
        },
      }
    );
  };

  const useUpdateUser = (id: string) => {
    return useMutation(
      async (data: User) => {
        const response = await axiosPrivate.put(`${usersURL}/${id}`, data);
        return response.data;
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries("users");
        },
        onError: (error) => {
          throw new Error(`Error updating user: ${error}`);
        },
      }
    );
  };

  const useDeleteUser = (id: string) => {
    return useMutation(
      async () => {
        const response = await axiosPrivate.delete(`${usersURL}/${id}`);
        return response.data;
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries("users");
        },
        onError: (error) => {
          throw new Error(`Error deleting user: ${error}`);
        },
      }
    );
  };

  return {
    useGetUsers,
    useGetUser,
    useCreateUser,
    useUpdateUser,
    useDeleteUser,
  };
};

export default useUsers;
