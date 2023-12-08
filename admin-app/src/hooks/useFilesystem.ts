import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useMutation, useQueryClient } from "react-query";
import Swal from "sweetalert2";

const useFilesystem = () => {
  const queryClient = useQueryClient();
  const axiosPrivate = useAxiosPrivate();
  const filesystemURL = "/api/v1/filesystem";

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

  const useDeleteFile = () => {
    return useMutation(
      async (data: string) => {
        const response = await axiosPrivate.delete(
          `${filesystemURL}/files`,
          {
            data: {
              path: data,
            },
          }
        );
        return response.data as string;
      },
      {
        onError: (error) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: `failed to delete file, ${error}`,
          });
        },
        onSuccess: () => {
          queryClient.invalidateQueries("filesystem");
        },
      }
    );
  };

  return {
    useUploadFile,
    useDeleteFile,
  };
};

export default useFilesystem;
