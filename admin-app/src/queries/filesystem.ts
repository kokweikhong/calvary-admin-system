import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "react-query";

const fsURL = "http://localhost:8080/api/v1/filesystem";

export const useUploadFile = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (data: FormData) => {
      const response = await axios.post(`${fsURL}/uploads`, data);
      return response.data as string;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("filesystem");
      },
    }
  );
};
