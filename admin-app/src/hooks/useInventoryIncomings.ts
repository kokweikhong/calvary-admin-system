import { InventoryIncoming } from "@/interfaces/inventory";
import { useQuery, useQueryClient, useMutation } from "react-query";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { config } from "@/lib/config";

const useInventoryIncomings = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  const inIncomingsURL = config.mainServiceURL + "/inventory/incomings";

  const getInventoryIncomings = () => {
    return useQuery("inventory-incomings", async () => {
      const { data } = await axiosPrivate.get(inIncomingsURL);
      return data as InventoryIncoming[];
    }, {
      onError: (error) => {
        console.log(error);
        throw new Error(`failed to get inventory incomings, ${error}`);
      }
    });
  }

  const getInventoryIncoming = (id: string) => {
    return useQuery(["inventory-incoming", id], async () => {
      const { data } = await axiosPrivate.get(`${inIncomingsURL}/${id}`);
      return data as InventoryIncoming;
    }, {
      onError: (error) => {
        console.log(error);
        throw new Error(`failed to get inventory incoming, ${error}`);
      }
    });
  }

  const createInventoryIncoming = () => {
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
    )
  }

  const updateInventoryIncoming = (id: string) => {
    return useMutation(
      async (data: InventoryIncoming) => {
        const response = await axiosPrivate.put(`${inIncomingsURL}/${id}`, data);
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
    )
  }

  const deleteInventoryIncoming = (id: string) => {
    return useMutation(
      async () => {
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
    )
  }

  return {
    getInventoryIncomings,
    getInventoryIncoming,
    createInventoryIncoming,
    updateInventoryIncoming,
    deleteInventoryIncoming,
  }

}

export default useInventoryIncomings;
