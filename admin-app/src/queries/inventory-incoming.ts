import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { InventoryProduct } from "@/app/interfaces/inventory";

const inIncomingURL = `${process.env.NEXT_PUBLIC_MAIN_SERVICE_URL}/api/v1/inventory/incomings`;
console.log(inIncomingURL);

export const useGetIncomings = () => {
  return useQuery("incomings", async () => {
    const { data } = await axios.get(inIncomingURL);
    return data;
  });
};

export const useGetIncoming = (id: string) => {
  return useQuery(["incoming", id], async () => {
    const { data } = await axios.get(`${inIncomingURL}/${id}`);
    return data;
  });
};

export const useCreateIncoming = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (incoming: InventoryProduct) => {
      const { data } = await axios.post(inIncomingURL, incoming);
      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("incomings");
      },
    }
  );
};

export const useUpdateIncoming = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation(
    async (incoming: InventoryProduct) => {
      const { data } = await axios.put(`${inIncomingURL}/${id}`, incoming);
      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("incomings");
      },
    }
  );
};

export const useDeleteIncoming = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (id: string) => {
      const { data } = await axios.delete(`${inIncomingURL}/${id}`);
      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("incomings");
      },
    }
  );
};
