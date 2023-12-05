import { InventoryOutgoing } from "@/interfaces/inventory";
import { useQuery, useQueryClient, useMutation } from "react-query";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { config } from "@/lib/config";

const useInventoryOutgoings = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  const inOutgoingsURL = config.mainServiceURL + "/inventory/outgoings";

  const getInventoryOutgoings = () => {
    return useQuery<InventoryOutgoing[], Error>("inventory-outgoings", async () => {
      const { data } = await axiosPrivate.get(inOutgoingsURL);
      return data as InventoryOutgoing[];
    }, {
      onError: (error) => {
        throw new Error(`failed to get inventory outgoings, ${error.message}`);
      }
    });
  }

  const getInventoryOutgoing = (id: string) => {
    return useQuery(["inventory-outgoing", id], async () => {
      const { data } = await axiosPrivate.get(`${inOutgoingsURL}/${id}`);
      return data as InventoryOutgoing;
    }, {
      onError: (error) => {
        console.log(error);
        throw new Error(`failed to get inventory outgoing, ${error}`);
      }
    });
  }

  const createInventoryOutgoing = () => {
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
    )
  }

  const updateInventoryOutgoing = (id: string) => {
    return useMutation(
      async (data: InventoryOutgoing) => {
        const response = await axiosPrivate.put(`${inOutgoingsURL}/${id}`, data);
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
    )
  }

  const deleteInventoryOutgoing = () => {
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
        }
      }
    )
  }

  return {
    getInventoryOutgoings,
    getInventoryOutgoing,
    createInventoryOutgoing,
    updateInventoryOutgoing,
    deleteInventoryOutgoing,
  }
}

export default useInventoryOutgoings;
