import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useMutation, useQueryClient } from "react-query";

const useFilesystem = () => {
  const queryClient = useQueryClient();
  const axiosPrivate = useAxiosPrivate();
  const filesystemURL = "/filesystem";

  const useUploadFile = () => {
    return useMutation(
      async (data: FormData) => {
        // axiosPrivate.defaults.headers.post["Content-Type"] = "multipart/form-data";
        const response = await axiosPrivate.post(
          `${filesystemURL}/uploads`,
          data
        );
        return response.data as string;
      },
      {
        onError: (error) => {
          console.log(error);
          throw new Error(`failed to upload file, ${error}`);
        },
        onSuccess: () => {
          queryClient.invalidateQueries("filesystem");
        },
      }
    );
  };

  return {
    useUploadFile,
  };
};

export default useFilesystem;
