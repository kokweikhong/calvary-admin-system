import { InventoryIncoming } from "@/interfaces/inventory";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";

const inIncomingURL = `${process.env.NEXT_PUBLIC_MAIN_SERVICE_URL}/api/v1/inventory/incomings`;
console.log(inIncomingURL);

export const useGetInventoryIncomings = () => {
  return useQuery("incomings", async () => {
    const { data } = await axios.get(inIncomingURL);
    return data as InventoryIncoming[];
  });
};

export const useGetInventoryIncoming = (id: string) => {
  return useQuery(["incoming", id], async () => {
    const { data } = await axios.get(`${inIncomingURL}/${id}`);
    return data as InventoryIncoming;
  });
};

export const useCreateInventoryIncoming = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (incoming: InventoryIncoming) => {
      await axios.post(inIncomingURL, incoming).then((response) => {
        return response.data;
      }).catch((error) => {
        throw new Error(`${error.response.data.message}`);
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("incomings");
      },
    }
  );
};

export const useUpdateInventoryIncoming = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation(
    async (incoming: InventoryIncoming) => {
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

export const useDeleteInventoryIncoming = () => {
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
