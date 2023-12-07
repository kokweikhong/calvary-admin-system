import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { InventoryOutgoing } from "@/interfaces/inventory";
import { useMutation, useQuery, useQueryClient } from "react-query";

const useInventoryOutgoings = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  const inOutgoingsURL = "/api/v1/inventory/outgoings";

  const useGetInventoryOutgoings = () => {
    return useQuery<InventoryOutgoing[], Error>(
      "inventory-outgoings",
      async () => {
        const { data } = await axiosPrivate.get(inOutgoingsURL);
        return data as InventoryOutgoing[];
      },
      {
        onError: (error) => {
          throw new Error(
            `failed to get inventory outgoings, ${error.message}`
          );
        },
      }
    );
  };

  const useGetInventoryOutgoing = (id: string) => {
    return useQuery({
      queryKey: ["inventory-outgoing", id],
      queryFn: async () => {
        const { data } = await axiosPrivate.get(`${inOutgoingsURL}/${id}`);
        return data as InventoryOutgoing;
      },
      enabled: !!id,
      onSuccess: () => {
        queryClient.invalidateQueries("inventory-outgoings");
      },
      onError: (error) => {
        console.log(error);
        throw new Error(`failed to get inventory outgoing, ${error}`);
      },
    });
  };

  const useCreateInventoryOutgoing = () => {
    return useMutation(
      async (data: InventoryOutgoing) => {
        const response = await axiosPrivate.post(inOutgoingsURL, data);
        return response.data;
      },
      {
        onError: (error) => {
          console.log(error);
          throw new Error(`failed to create inventory outgoing, ${error}`);
        },
        onSuccess: () => {
          queryClient.invalidateQueries("inventory-outgoings");
        },
      }
    );
  };

  const useUpdateInventoryOutgoing = (id: string) => {
    return useMutation(
      async (data: InventoryOutgoing) => {
        const response = await axiosPrivate.put(
          `${inOutgoingsURL}/${id}`,
          data
        );
        return response.data;
      },
      {
        onError: (error) => {
          console.log(error);
          throw new Error(`failed to update inventory outgoing, ${error}`);
        },
        onSuccess: () => {
          queryClient.invalidateQueries("inventory-outgoings");
        },
      }
    );
  };

  const useDeleteInventoryOutgoing = () => {
    return useMutation(
      async (id: string) => {
        const response = await axiosPrivate.delete(`${inOutgoingsURL}/${id}`);
        return response.data;
      },
      {
        onError: (error) => {
          console.log(error);
          throw new Error(`failed to delete inventory outgoing, ${error}`);
        },
        onSuccess: () => {
          queryClient.invalidateQueries("inventory-outgoings");
        },
      }
    );
  };

  return {
    useGetInventoryOutgoings,
    useGetInventoryOutgoing,
    useCreateInventoryOutgoing,
    useUpdateInventoryOutgoing,
    useDeleteInventoryOutgoing,
  };
};

export default useInventoryOutgoings;
