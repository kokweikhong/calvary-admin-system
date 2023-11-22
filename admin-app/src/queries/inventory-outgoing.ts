import { InventoryOutgoing } from "@/interfaces/inventory";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";

const inOutgoingURL = `${process.env.REACT_APP_API_URL}/api/v1/inventory/outgoings`;

export const useGetInventoryOutgoings = () => {
  return useQuery("outgoings", async () => {
    const { data } = await axios.get(inOutgoingURL);
    return data as InventoryOutgoing[];
  });
};

export const useGetInventoryOutgoing = (id: string) => {
  return useQuery(["outgoing", id], async () => {
    const { data } = await axios.get(`${inOutgoingURL}/${id}`);
    return data as InventoryOutgoing;
  });
};

export const useCreateInventoryOutgoing = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (outgoing: InventoryOutgoing) => {
      const { data } = await axios.post(inOutgoingURL, outgoing);
      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("outgoings");
      },
    }
  );
};

export const useUpdateInventoryOutgoing = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation(
    async (outgoing: InventoryOutgoing) => {
      const { data } = await axios.put(`${inOutgoingURL}/${id}`, outgoing);
      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("outgoings");
      },
    }
  );
};

export const useDeleteInventoryOutgoing = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (id: string) => {
      const { data } = await axios.delete(`${inOutgoingURL}/${id}`);
      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("outgoings");
      },
    }
  );
};
