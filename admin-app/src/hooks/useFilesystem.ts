import { useMutation, useQueryClient } from "react-query";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { config } from "@/lib/config";

const useFilesystem = () => {
  const queryClient = useQueryClient();
  const axiosPrivate = useAxiosPrivate();
  const filesystemURL = config.mainServiceURL + "/filesystem";

  const uploadFile = () => {
    return useMutation(
      async (data: FormData) => {
        // axiosPrivate.defaults.headers.post["Content-Type"] = "multipart/form-data";
        const response = await axiosPrivate.post(`${filesystemURL}/uploads`, data);
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
  }

  return {
    uploadFile,
  }

}

export default useFilesystem;
