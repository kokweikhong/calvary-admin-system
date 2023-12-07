import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { InventoryIncoming } from "@/interfaces/inventory";
import { useMutation, useQuery, useQueryClient } from "react-query";

const useInventoryIncomings = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  const inIncomingsURL = "/api/v1/inventory/incomings";

  const useGetInventoryIncomings = () => {
    return useQuery(
      "inventory-incomings",
      async () => {
        const { data } = await axiosPrivate.get(inIncomingsURL);
        return data as InventoryIncoming[];
      },
      {
        onError: (error) => {
          console.log(error);
          throw new Error(`failed to get inventory incomings, ${error}`);
        },
      }
    );
  };

  const useGetInventoryIncoming = (id: string) => {
    return useQuery({
      queryKey: ["inventory-incoming", id],
      queryFn: async () => {
        const { data } = await axiosPrivate.get(`${inIncomingsURL}/${id}`);
        return data as InventoryIncoming;
      },
      enabled: !!id,
      onSuccess: () => {
        queryClient.invalidateQueries("inventory-incomings");
      },
      onError: (error) => {
        console.log(error);
        throw new Error(`failed to get inventory incoming, ${error}`);
      },
    });
  };

  const useCreateInventoryIncoming = () => {
    return useMutation(
      async (data: InventoryIncoming) => {
        const response = await axiosPrivate.post(inIncomingsURL, data);
        return response.data;
      },
      {
        onError: (error) => {
          console.log(error);
          throw new Error(`failed to create inventory incoming, ${error}`);
        },
        onSuccess: () => {
          queryClient.invalidateQueries("inventory-incomings");
        },
      }
    );
  };

  const useUpdateInventoryIncoming = (id: string) => {
    return useMutation(
      async (data: InventoryIncoming) => {
        const response = await axiosPrivate.put(
          `${inIncomingsURL}/${id}`,
          data
        );
        return response.data;
      },
      {
        onError: (error) => {
          console.log(error);
          throw new Error(`failed to update inventory incoming, ${error}`);
        },
        onSuccess: () => {
          queryClient.invalidateQueries("inventory-incomings");
        },
      }
    );
  };

  const useDeleteInventoryIncoming = () => {
    return useMutation(
      async (id: string) => {
        const response = await axiosPrivate.delete(`${inIncomingsURL}/${id}`);
        return response.data;
      },
      {
        onError: (error) => {
          console.log(error);
          throw new Error(`failed to delete inventory incoming, ${error}`);
        },
        onSuccess: () => {
          queryClient.invalidateQueries("inventory-incomings");
        },
      }
    );
  };

  return {
    useGetInventoryIncomings,
    useGetInventoryIncoming,
    useCreateInventoryIncoming,
    useUpdateInventoryIncoming,
    useDeleteInventoryIncoming,
  };
};

export default useInventoryIncomings;
